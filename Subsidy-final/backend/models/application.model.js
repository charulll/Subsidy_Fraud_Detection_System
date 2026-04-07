import db from "../config/db.js";

export const Application = {
  // Get by ID
  findByPk: async (id) => {
    const result = await db.query(
      "SELECT * FROM applications WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  // Get all
  findAll: async () => {
    const result = await db.query("SELECT * FROM applications");
    return result.rows;
  },

  // Create
  create: async (data) => {
    const { scheme, amount, income, previous_applications, status } = data;

    const result = await db.query(
      `INSERT INTO applications (scheme, amount, income, previous_applications, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [scheme, amount, income, previous_applications, status || "pending"]
    );

    return result.rows[0];
  },

  // Update status (for AI flagging)
  updateStatus: async (id, status) => {
    await db.query(
      "UPDATE applications SET status = $1 WHERE id = $2",
      [status, id]
    );
  }
};