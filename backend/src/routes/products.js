const express = require("express");
const router = express.Router();
const pool = require("../db/db");

router.get("/", async (req, res) => {
  try {
    const {
  category,
  cursor,
  limit = 20,
  snapshotTime,
} = req.query;

const currentSnapshot =
  snapshotTime || new Date().toISOString();

    let query = `
      SELECT *
      FROM products
    `;

    const values = [];
    const conditions = [];
    values.push(currentSnapshot);

conditions.push(
  `updated_at <= $${values.length}`
);

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (cursor) {
      const decoded = JSON.parse(
        Buffer.from(cursor, "base64").toString()
      );

      values.push(decoded.updated_at);
      values.push(decoded.id);

      conditions.push(`
        (
          updated_at < $${values.length - 1}
          OR
          (
            updated_at = $${values.length - 1}
            AND id < $${values.length}
          )
        )
      `);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    values.push(Number(limit) + 1);

    query += `
      ORDER BY updated_at DESC, id DESC
      LIMIT $${values.length}
    `;

    const result = await pool.query(query, values);

    const hasMore = result.rows.length > limit;

    const products = hasMore
      ? result.rows.slice(0, limit)
      : result.rows;

    let nextCursor = null;

    if (hasMore) {
      const lastItem = products[products.length - 1];

      nextCursor = Buffer.from(
        JSON.stringify({
          updated_at: lastItem.updated_at,
          id: lastItem.id,
        })
      ).toString("base64");
    }

    res.json({
      products,
      nextCursor,
      hasMore,
      snapshotTime: currentSnapshot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

module.exports = router;