const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const productsRoute = require("./routes/products");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productsRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Product Browser API Running",
  });
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("Database Error:", err);
  } else {
    console.log("Database Connected");
    console.log(result.rows[0]);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});