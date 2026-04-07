import pkg from "pg";
const { Pool } = pkg;

export  const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

db.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.error("DB connection error:", err));

export default db;