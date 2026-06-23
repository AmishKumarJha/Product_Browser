const pool = require("../db/db");
const { faker } = require("@faker-js/faker");

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Sports",
  "Toys",
  "Home",
  "Automotive",
  "Health",
];

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;

async function seedProducts() {
  try {
    console.log("Starting seed...");

    for (let offset = 0; offset < TOTAL_PRODUCTS; offset += BATCH_SIZE) {
      const values = [];
      const placeholders = [];

      let paramIndex = 1;

      for (
        let i = 0;
        i < BATCH_SIZE && offset + i < TOTAL_PRODUCTS;
        i++
      ) {
        const name = faker.commerce.productName();

        const category =
          categories[Math.floor(Math.random() * categories.length)];

        const price = parseFloat(
          faker.commerce.price({ min: 10, max: 5000 })
        );

        const createdAt = faker.date.past();
        const updatedAt = faker.date.between({
          from: createdAt,
          to: new Date(),
        });

        placeholders.push(
          `($${paramIndex++},$${paramIndex++},$${paramIndex++},$${paramIndex++},$${paramIndex++})`
        );

        values.push(
          name,
          category,
          price,
          createdAt,
          updatedAt
        );
      }

      await pool.query(
        `
        INSERT INTO products
        (name, category, price, created_at, updated_at)
        VALUES ${placeholders.join(",")}
      `,
        values
      );

      console.log(
        `Inserted ${Math.min(offset + BATCH_SIZE, TOTAL_PRODUCTS)} products`
      );
    }

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedProducts();