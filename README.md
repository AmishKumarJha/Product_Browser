**Deployed Link :** https://product-browser-two.vercel.app/

# Product Browser

A scalable product browsing application built with **Node.js, Express, PostgreSQL, and React** that supports browsing **200,000+ products**, category filtering, and high-performance pagination while maintaining consistency when data changes during browsing.

## Features

* Browse 200,000+ products
* Category-based filtering
* Cursor-based (keyset) pagination
* Snapshot consistency during browsing
* PostgreSQL indexing for fast queries
* Bulk data seeding (200,000 records)
* Simple React frontend
* Cloud-ready deployment (Neon + Render + Vercel)

---

## Tech Stack

### Backend

* Node.js
* Express.js
* PostgreSQL


### Frontend

* React
* Vite

### Database Hosting

* Neon PostgreSQL

### Deployment

* Render (Backend)
* Vercel (Frontend)

---

## Problem Statement

The application allows users to browse approximately **200,000 products** sorted by newest updates first.

Requirements:

* Fast pagination
* Category filtering
* Correct results while data is changing
* No duplicate products
* No missing products

---

## Database Schema

### Products Table

| Column     | Type                  |
| ---------- | --------------------- |
| id         | BIGSERIAL PRIMARY KEY |
| name       | TEXT                  |
| category   | TEXT                  |
| price      | NUMERIC(10,2)         |
| created_at | TIMESTAMP             |
| updated_at | TIMESTAMP             |

---

## Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd product-browser
```

---

### Backend

```bash
cd backend

npm install
```

Create `.env`

```env
DATABASE_URL=your_postgres_connection_string
PORT=5000
```

Create database tables:

```bash
node src/setup/createTable.js
```

Seed data:
```bash
npm run seed
```

Run backend:
```bash
npm run dev
```

Backend runs on:

http://localhost:5000

---

### Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on:

http://localhost:5173

---

### The Reason I Selected Each Item

- Cursor-based pagination, sorted with `updated_at DESC, id DESC`, is my choice for pagination instead of offset pagination. In offset pagination,the higher the page number, the slower it gets to load, and also there's a risk of getting duplicate products or products missing from the list when you're looking through products, because during this time there may be changes made to the products.

- I used snapshot-based consistency handling for concurrent updates while users are browsing through products. Basically, the first request to the server will create a snapshot timestamp for whichever time it was created. At that point, all subsequent page requests will only return products that contain a `updated_at` timestamp that is less than or equal to the snapshot timestamp. In doing this, it creates a stable state of the dataset for the user while browsing the products and prevents them from seeing duplicate products or products that are missing from the dataset while they are browsing.

- I created indexes in Postgres on `(updated_at DESC, id DESC)` and `(category, updated_at DESC, id DESC)` for the table that contains the columns `category`, `id`, and `updated_at`, in order to optimize filtering and pagination.

- For generating the data to populate the products, I created a seed script that would insert `200,000 products` into the database using batched bulk inserts, which would insert `5,000 rows at a time` for each batch, instead of inserting them one product at a time. This reduced the amount of round trips to the database and overall improved performance.

### Improvements that could have been made with more time

- Create an infinite scroll, instead of a Next Page button.
- Create automated tests to verify the consistency of pagination and the handling of cursors.
- Implement API rate limiting and request validation.
- Implement caching for category filters that are frequently accessed.
- Measure and document query performance with the use of PostgreSQL 
- Use Docker to make deploying the application easier.  

### Use of Artificial Intelligence (AI)

AI was used primarily to support development by expediting implementation time, experimenting with interface pagination strategies, and generating boilerplate for both the frontend and backend of the project.

Once created, each piece of generated code was verified by myself prior to its use in the application and was further modified by me when my understanding of the requirements suggested a different implementation. An example of this involved my choosing to implement cursor-based pagination with snapshot consistency instead of utilizing traditional pagination due to an emphasis on maintaining consistency ("fluid" - no products replicated/missed while data was being updated).

In addition, I reviewed and corrected deployment configuration settings, database configuration settings, and integration details prior to implementing them.

## Author

**Amish Kumar Jha**

B.Tech Computer Science Engineering
Sister Nivedita University
