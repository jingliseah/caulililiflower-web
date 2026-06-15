import { v4 as uuidv4 } from "uuid";
import { squarePost, LOCATION_ID } from "./client.js";

const BATCH_SIZE = 100;

/**
 * Returns a map of { [variationId]: quantity } for the given variation IDs.
 */
export async function getInventoryCounts(variationIds) {
  const counts = {};
  for (let i = 0; i < variationIds.length; i += BATCH_SIZE) {
    const batch = variationIds.slice(i, i + BATCH_SIZE);
    const data = await squarePost("/inventory/batch-retrieve-counts", {
      catalog_object_ids: batch,
      location_ids: [LOCATION_ID],
    });
    for (const c of data.counts || []) {
      counts[c.catalog_object_id] = parseFloat(c.quantity || 0);
    }
  }
  return counts;
}

/**
 * Sets an exact stock quantity for one or more variations via PHYSICAL_COUNT.
 * @param {Array<{ variationId: string, quantity: number }>} changes
 */
export async function setInventoryCounts(changes) {
  const occurredAt = new Date().toISOString();
  const data = await squarePost("/inventory/changes/batch-create", {
    idempotency_key: uuidv4(),
    changes: changes.map((c) => ({
      type: "PHYSICAL_COUNT",
      physical_count: {
        catalog_object_id: c.variationId,
        location_id: LOCATION_ID,
        quantity: String(Math.max(0, Math.round(c.quantity))),
        occurred_at: occurredAt,
        state: "IN_STOCK",
      },
    })),
  });
  return data;
}
