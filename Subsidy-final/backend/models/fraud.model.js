import db from "../config/db.js";

export const Fraud = {
  create: async (data) => {
    const { applicationId, isFraud, threat, accuracy } = data;

    const result = await db.query(
      `INSERT INTO frauds (applicationId, isFraud, threat, accuracy)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [applicationId, isFraud, threat, accuracy]
    );

    return result.rows[0];
  },

  findByApplication: async (applicationId) => {
    const result = await db.query(
      "SELECT * FROM frauds WHERE applicationId = $1",
      [applicationId]
    );
    return result.rows[0];
  }
};