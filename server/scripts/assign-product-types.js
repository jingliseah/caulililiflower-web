/**
 * One-time script: assigns the "Product Type" custom attribute to every
 * catalog ITEM in Square based on SKU prefix:
 *   KEY-*  → Keychain
 *   PIN-*  → Brooch
 *   KP-*   → Keychain + Brooch
 *
 * Run: node scripts/assign-product-types.js
 */

import "dotenv/config";
import fetch from "node-fetch";

const BASE_URL = process.env.SQUARE_BASE_URL || "https://connect.squareup.com/v2";
const VERSION  = process.env.SQUARE_VERSION  || "2023-08-16";
const TOKEN    = process.env.SQUARE_ACCESS_TOKEN;

const ATTRIBUTE_KEY = "1e2a6354-4907-49ef-aed2-803a1bfe8c63";

const TYPE_UID = {
  "Keychain":             "YKFR5A54EANZHEGTJZL2T7HP",
  "Brooch":               "4D3MMET3UIZQ22ALFSZS55EP",
  "Keychain + Brooch":    "VB6RGAJUKHAOQF3RQQA6ZFCF",
};

const HEADERS = {
  "Authorization": `Bearer ${TOKEN}`,
  "Square-Version": VERSION,
  "Content-Type": "application/json",
};

function getTypeFromSku(sku = "") {
  const s = sku.toUpperCase();
  if (s.startsWith("KP-"))  return "Keychain + Brooch";
  if (s.startsWith("KEY-")) return "Keychain";
  if (s.startsWith("PIN-")) return "Brooch";
  return null;
}

async function fetchAllItems() {
  const items = [];
  let cursor = null;

  do {
    const url = `${BASE_URL}/catalog/list?types=ITEM${cursor ? `&cursor=${cursor}` : ""}`;
    const res  = await fetch(url, { headers: HEADERS });
    const data = await res.json();

    if (data.errors) {
      console.error("Error fetching catalog:", data.errors);
      process.exit(1);
    }

    items.push(...(data.objects || []));
    cursor = data.cursor || null;
  } while (cursor);

  return items;
}

async function fetchAllVariations(itemIds) {
  const variations = {};
  const BATCH = 100;

  for (let i = 0; i < itemIds.length; i += BATCH) {
    const batch = itemIds.slice(i, i + BATCH);
    const res   = await fetch(`${BASE_URL}/catalog/batch-retrieve`, {
      method:  "POST",
      headers: HEADERS,
      body: JSON.stringify({ object_ids: batch, include_related_objects: true }),
    });
    const data = await res.json();

    for (const obj of data.objects || []) {
      if (obj.type !== "ITEM") continue;
      const vars = obj.item_data?.variations || [];
      variations[obj.id] = vars.map((v) => ({
        sku:  v.item_variation_data?.sku || "",
        name: v.item_variation_data?.name || "",
      }));
    }

    for (const obj of data.related_objects || []) {
      if (obj.type !== "ITEM_VARIATION") continue;
    }
  }

  return variations;
}

async function upsertAttributes(assignments) {
  const BATCH = 25;
  let total = 0;

  for (let i = 0; i < assignments.length; i += BATCH) {
    const batch = assignments.slice(i, i + BATCH);

    const values = {};
    for (const { itemId, type } of batch) {
      values[itemId] = {
        [ATTRIBUTE_KEY]: {
          key: ATTRIBUTE_KEY,
          selection_uid_values: [TYPE_UID[type]],
        },
      };
    }

    const res  = await fetch(`${BASE_URL}/catalog/custom-attributes/batch-upsert`, {
      method:  "POST",
      headers: HEADERS,
      body: JSON.stringify({ values }),
    });
    const data = await res.json();

    if (data.errors?.length) {
      console.error("Batch upsert error:", JSON.stringify(data.errors, null, 2));
    } else {
      total += batch.length;
      console.log(`  ✓ Assigned ${total}/${assignments.length}`);
    }
  }
}

async function main() {
  console.log("Fetching all catalog items from Square...");
  const items = await fetchAllItems();
  console.log(`Found ${items.length} items. Fetching variations...`);

  const itemIds    = items.map((i) => i.id);
  const variations = await fetchAllVariations(itemIds);

  const assignments = [];
  const skipped     = [];

  for (const item of items) {
    const vars = variations[item.id] || [];

    // Collect all types from all variations
    const types = new Set();
    for (const v of vars) {
      const t = getTypeFromSku(v.sku);
      if (t) types.add(t);
    }

    if (types.size === 0) {
      skipped.push({ name: item.item_data?.name, vars: vars.map((v) => v.sku).join(", ") });
      continue;
    }

    // If multiple types detected, use the most specific
    // Priority: Keychain + Brooch > Keychain > Brooch
    let type;
    if (types.has("Keychain + Brooch")) type = "Keychain + Brooch";
    else if (types.has("Keychain") && types.has("Brooch")) type = "Keychain + Brooch";
    else if (types.has("Keychain")) type = "Keychain";
    else type = "Brooch";

    assignments.push({ itemId: item.id, name: item.item_data?.name, type });
  }

  console.log(`\nWill assign types to ${assignments.length} items:`);
  const counts = {};
  for (const a of assignments) {
    counts[a.type] = (counts[a.type] || 0) + 1;
  }
  for (const [type, count] of Object.entries(counts)) {
    console.log(`  ${type}: ${count}`);
  }

  if (skipped.length) {
    console.log(`\nSkipping ${skipped.length} items (no matching SKU prefix):`);
    for (const s of skipped) {
      console.log(`  - ${s.name} (SKUs: ${s.vars || "none"})`);
    }
  }

  if (assignments.length === 0) {
    console.log("\nNothing to assign. Check your SKU prefixes.");
    return;
  }

  console.log("\nAssigning custom attributes in Square...");
  await upsertAttributes(assignments);

  console.log(`\nDone! ${assignments.length} items updated in Square.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
