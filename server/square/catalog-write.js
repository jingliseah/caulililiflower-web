import { v4 as uuidv4 } from "uuid";
import FormData from "form-data";
import fetch from "node-fetch";
import { squareGet, squarePost } from "./client.js";

const BASE_URL = process.env.SQUARE_BASE_URL || "https://connect.squareup.com/v2";
const VERSION  = process.env.SQUARE_VERSION  || "2023-08-16";
const TOKEN    = process.env.SQUARE_ACCESS_TOKEN;

/** Price in RM → Square price_money in cents */
function rmToCents(rm) {
  return Math.round(Number(rm) * 100);
}

/**
 * Create a new catalog ITEM in Square.
 *
 * @param {object} opts
 * @param {string} opts.name
 * @param {string} [opts.description]
 * @param {string} [opts.categoryId]  — Square category object ID
 * @param {Array}  opts.variations    — [{ name, price, sku }]
 */
export async function createItem({ name, description, categoryId, variations }) {
  const itemId = "#new_item";

  const variationObjects = variations.map((v, i) => ({
    type: "ITEM_VARIATION",
    id: `#variation_${i}`,
    item_variation_data: {
      item_id: itemId,
      name: v.name || "Regular",
      pricing_type: "FIXED_PRICING",
      price_money: { amount: rmToCents(v.price), currency: "MYR" },
      ...(v.sku ? { sku: v.sku } : {}),
    },
  }));

  const body = {
    idempotency_key: uuidv4(),
    object: {
      type: "ITEM",
      id: itemId,
      item_data: {
        name,
        ...(description ? { description } : {}),
        ...(categoryId ? { category_id: categoryId } : {}),
        variations: variationObjects,
      },
    },
  };

  const data = await squarePost("/catalog/object", body);
  return data.catalog_object;
}

/**
 * Update an existing ITEM in Square.
 * Fetches the current version first, then sends the full updated object.
 */
export async function updateItem(id, { name, description, categoryId, variations }) {
  // Fetch current object to get the version number
  const current = await squareGet(`/catalog/object/${id}`);
  const obj = current.object;
  if (!obj) throw new Error(`Item ${id} not found in Square`);

  // Build updated variations — preserve existing variation IDs where possible
  const existingVariations = obj.item_data?.variations || [];

  const updatedVariations = variations.map((v, i) => {
    const existing = existingVariations[i];
    return {
      type: "ITEM_VARIATION",
      id: existing?.id || `#new_variation_${i}`,
      version: existing?.version,
      item_variation_data: {
        item_id: id,
        name: v.name || "Regular",
        pricing_type: "FIXED_PRICING",
        price_money: { amount: rmToCents(v.price), currency: "MYR" },
        ...(v.sku ? { sku: v.sku } : {}),
      },
    };
  });

  const body = {
    idempotency_key: uuidv4(),
    object: {
      type: "ITEM",
      id,
      version: obj.version,
      item_data: {
        name,
        ...(description ? { description } : {}),
        ...(categoryId ? { category_id: categoryId } : {}),
        variations: updatedVariations,
      },
    },
  };

  const data = await squarePost("/catalog/object", body);
  return data.catalog_object;
}

/**
 * Delete an item from Square catalog.
 */
export async function deleteItem(id) {
  const res = await fetch(`${BASE_URL}/catalog/object/${id}`, {
    method: "DELETE",
    headers: {
      "Square-Version": VERSION,
      "Authorization": `Bearer ${TOKEN}`,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Square DELETE failed (${res.status}): ${text}`);
  }
  return res.json();
}

/**
 * Upload an image file to Square and attach it to a catalog item.
 * @param {string}  itemId   — Square item object ID
 * @param {Buffer}  buffer   — image file buffer
 * @param {string}  filename — original filename
 * @param {string}  mimetype — e.g. "image/jpeg"
 */
export async function uploadItemImage(itemId, buffer, filename, mimetype) {
  const form = new FormData();

  const requestBody = JSON.stringify({
    idempotency_key: uuidv4(),
    object_id: itemId,
    image: {
      type: "IMAGE",
      id: "#new_image",
      image_data: { caption: filename },
    },
  });

  form.append("request", requestBody, { contentType: "application/json" });
  form.append("image_file", buffer, { filename, contentType: mimetype });

  const res = await fetch(`${BASE_URL}/catalog/images`, {
    method: "POST",
    headers: {
      "Square-Version": VERSION,
      "Authorization": `Bearer ${TOKEN}`,
      ...form.getHeaders(),
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Square image upload failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.image?.image_data?.url || null;
}
