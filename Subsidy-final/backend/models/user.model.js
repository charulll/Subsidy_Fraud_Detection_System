import db from "../config/db.js";

export const User = {
  findByEmail: async (email) => {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0];
  },

  create: async (data) => {
    const { name, email, aadhaar } = data;

    const result = await db.query(
      `INSERT INTO users (name, email, aadhaar)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, email, aadhaar]
    );

    return result.rows[0];
  }
};