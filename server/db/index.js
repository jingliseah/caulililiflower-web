import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || "jingli",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "jingli",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT) || 5432,
});

export default pool;
