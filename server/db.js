const path = require("node:path");
const { Pool } = require("pg");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env.server.local"),
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env.server.local");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = { pool };
