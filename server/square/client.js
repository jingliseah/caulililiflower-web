import "dotenv/config";
import fetch from "node-fetch";

const BASE_URL = process.env.SQUARE_BASE_URL || "https://connect.squareup.com/v2";
const VERSION  = process.env.SQUARE_VERSION  || "2023-08-16";
const TOKEN    = process.env.SQUARE_ACCESS_TOKEN;

if (!TOKEN) {
  throw new Error("SQUARE_ACCESS_TOKEN is not set in environment variables");
}

const defaultHeaders = {
  "Square-Version": VERSION,
  "Authorization": `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

export async function squareGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: defaultHeaders });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Square GET ${path} failed (${res.status}): ${body}`);
  }
  return res.json();
}

export async function squarePost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Square POST ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

export const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
