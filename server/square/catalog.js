import { squareGet, squarePost } from "./client.js";
import { getInventoryCounts } from "./inventory.js";

const BATCH_SIZE = 100;

/** Derive product type from variation SKU prefixes. */
function getProductType(variations) {
  const types = new Set();
  for (const v of variations) {
    const sku = (v.sku || "").toUpperCase();
    if (sku.startsWith("KP-"))  types.add("Keychain + Brooch");
    else if (sku.startsWith("KEY-")) types.add("Keychain");
    else if (sku.startsWith("PIN-")) types.add("Brooch");
    else if (sku.startsWith("PC-"))  types.add("Postcard");
  }
  if (types.size === 0) return null;
  if (types.has("Keychain + Brooch")) return "Keychain + Brooch";
  if (types.has("Keychain") && types.has("Brooch")) return "Keychain + Brooch";
  if (types.size === 1) return [...types][0];
  return [...types][0];
}

/** Convert Square price_money (cents) to a number in RM. */
function centsToRM(priceMoney) {
  if (!priceMoney || priceMoney.amount == null) return 0;
  return priceMoney.amount / 100;
}

/** Extract the primary image URL from related_objects for a given item. */
function getPrimaryImageUrl(itemData, relatedObjects) {
  const imageIds = itemData.image_ids || [];
  if (!imageIds.length) return null;
  const imageObj = relatedObjects.find(
    (r) => r.type === "IMAGE" && r.id === imageIds[0]
  );
  return imageObj?.image_data?.url || null;
}

/** Extract the first category name from related_objects. */
function getCategoryInfo(itemData, relatedObjects) {
  const categoryId = itemData.category_id || null;
  const catObj = relatedObjects.find(
    (r) => r.type === "CATEGORY" && r.id === categoryId
  );
  return {
    category_id: categoryId,
    category_name: catObj?.category_data?.name || null,
  };
}

/**
 * Normalises a Square ITEM object + its related_objects into the
 * shape the frontend expects.
 */
function normaliseItem(obj, relatedObjects, inventoryCounts = {}) {
  const data = obj.item_data || {};
  const variations = (data.variations || []).map((v) => {
    const vd = v.item_variation_data || {};
    return {
      id: v.id,
      name: vd.name || "Standard",
      price: centsToRM(vd.price_money),
      sku: vd.sku || null,
      quantity: inventoryCounts[v.id] ?? 0,
      in_stock: (inventoryCounts[v.id] ?? 0) > 0,
    };
  });

  const basePrice = variations.length > 0 ? variations[0].price : 0;
  const anyInStock = variations.some((v) => v.in_stock);

  return {
    id: obj.id,
    name: data.name || "",
    description: data.description || "",
    price: basePrice,
    image_url: getPrimaryImageUrl(data, relatedObjects),
    ...getCategoryInfo(data, relatedObjects),
    product_type: getProductType(variations),
    in_stock: anyInStock,
    variations,
  };
}

/**
 * Fetch all active ITEM objects from Square catalog (paginated).
 * Returns a normalised array — inventory counts included.
 * Category names are resolved from a separately-fetched category map.
 */
export async function listProducts() {
  // Fetch items and categories in parallel
  const [items, categoryObjects] = await Promise.all([
    (async () => {
      const all = [];
      let cursor = null;
      do {
        const url = `/catalog/list?types=ITEM${cursor ? `&cursor=${cursor}` : ""}`;
        const data = await squareGet(url);
        all.push(...(data.objects || []));
        cursor = data.cursor || null;
      } while (cursor);
      return all;
    })(),
    (async () => {
      const all = [];
      let cursor = null;
      do {
        const url = `/catalog/list?types=CATEGORY${cursor ? `&cursor=${cursor}` : ""}`;
        const data = await squareGet(url);
        all.push(...(data.objects || []));
        cursor = data.cursor || null;
      } while (cursor);
      return all;
    })(),
  ]);

  // Build a category ID → name lookup map
  const categoryMap = {};
  for (const c of categoryObjects) {
    categoryMap[c.id] = c.category_data?.name || "";
  }

  // Collect all variation IDs for a single batch inventory call
  const variationIds = items.flatMap((item) =>
    (item.item_data?.variations || []).map((v) => v.id)
  );
  const inventoryCounts = variationIds.length
    ? await getInventoryCounts(variationIds)
    : {};

  // Batch-retrieve all item IDs with related objects to get image URLs
  const itemIds = items.map((i) => i.id);
  const relatedByItemId = {};

  for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
    const batch = itemIds.slice(i, i + BATCH_SIZE);
    const data = await squarePost("/catalog/batch-retrieve", {
      object_ids: batch,
      include_related_objects: true,
    });
    const related = data.related_objects || [];
    for (const obj of data.objects || []) {
      relatedByItemId[obj.id] = related;
    }
  }

  return items.map((item) => {
    const related = relatedByItemId[item.id] || [];
    const product = normaliseItem(item, related, inventoryCounts);
    if (product.category_id && categoryMap[product.category_id]) {
      product.category_name = categoryMap[product.category_id];
    }
    return product;
  });
}

/**
 * Fetch a single product by Square catalog object ID, with full detail
 * (images, category, all variations + inventory).
 */
export async function getProductById(id) {
  const data = await squareGet(
    `/catalog/object/${id}?include_related_objects=true`
  );
  const obj = data.object;
  if (!obj || obj.type !== "ITEM") return null;

  const relatedObjects = data.related_objects || [];
  const variationIds = (obj.item_data?.variations || []).map((v) => v.id);
  const inventoryCounts = variationIds.length
    ? await getInventoryCounts(variationIds)
    : {};

  return normaliseItem(obj, relatedObjects, inventoryCounts);
}

/**
 * Fetch all CATEGORY objects from Square catalog.
 */
export async function listCategories() {
  const categories = [];
  let cursor = null;

  do {
    const url = `/catalog/list?types=CATEGORY${cursor ? `&cursor=${cursor}` : ""}`;
    const data = await squareGet(url);
    categories.push(...(data.objects || []));
    cursor = data.cursor || null;
  } while (cursor);

  return categories.map((c) => ({
    id: c.id,
    name: c.category_data?.name || "",
  }));
}
