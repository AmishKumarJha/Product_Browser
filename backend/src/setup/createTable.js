const pool = require("../db/db");

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_browse
      ON products (
        category,
        updated_at DESC,
        id DESC
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_updated
      ON products (
        updated_at DESC,
        id DESC
      );
    `);

    console.log("Table and indexes created successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createTable();