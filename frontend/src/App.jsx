import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [snapshotTime, setSnapshotTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (
    cursor = null,
    selectedCategory = category,
    snapshot = snapshotTime
  ) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      if (cursor) {
        params.append("cursor", cursor);
      }

      if (snapshot) {
        params.append("snapshotTime", snapshot);
      }

      // const response = await axios.get(
      //   `http://localhost:5000/products?${params.toString()}`
      // );
      const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/products?${params.toString()}`
);


      setProducts(response.data.products);
      setNextCursor(response.data.nextCursor);

      if (!snapshot && response.data.snapshotTime) {
        setSnapshotTime(response.data.snapshotTime);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;

    setCategory(selected);
    setSnapshotTime(null);
    setNextCursor(null);

    fetchProducts(null, selected, null);
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Product Browser
      </h1>

      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <p>
          <strong>Total Records:</strong> 200,000
        </p>

        <p>
          <strong>Pagination:</strong> Cursor Based + Snapshot Consistency
        </p>

        <p>
          <strong>Snapshot:</strong>{" "}
          {snapshotTime
            ? new Date(snapshotTime).toLocaleString()
            : "Loading..."}
        </p>

        <label>
          <strong>Category:</strong>{" "}
          <select
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Clothing">Clothing</option>
            <option value="Sports">Sports</option>
            <option value="Toys">Toys</option>
            <option value="Home">Home</option>
            <option value="Automotive">Automotive</option>
            <option value="Health">Health</option>
          </select>
        </label>
      </div>

      {loading ? (
        <h3 style={{ textAlign: "center" }}>Loading...</h3>
      ) : (
        <>
          <p
            style={{
              marginBottom: "15px",
              fontWeight: "bold",
            }}
          >
            Showing {products.length} products
          </p>

          <table
            border="1"
            cellPadding="10"
            cellSpacing="0"
            width="100%"
            style={{
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Updated At</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price}</td>
                  <td>
                    {new Date(
                      product.updated_at
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <button
              disabled={!nextCursor}
              onClick={() =>
                fetchProducts(
                  nextCursor,
                  category,
                  snapshotTime
                )
              }
              style={{
                padding: "12px 24px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Load Next 20 Products
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;