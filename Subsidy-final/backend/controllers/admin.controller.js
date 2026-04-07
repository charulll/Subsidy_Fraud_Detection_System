import { db } from "../config/db.js";  


export const getAdminStats = async (req, res) => {
  try {
    const total = await db.query("SELECT COUNT(*) FROM applications");
    const approved = await db.query("SELECT COUNT(*) FROM applications WHERE status='approved'");
    const pending = await db.query("SELECT COUNT(*) FROM applications WHERE status='pending'");
    const rejected = await db.query("SELECT COUNT(*) FROM applications WHERE status='rejected'");
    const flagged = await db.query(
  "SELECT COUNT(*) FROM applications WHERE LOWER(fraud) = 'fraud'"
);
    const amount = await db.query("SELECT COALESCE(SUM(amount),0) AS total FROM applications");

    res.json({
      total: Number(total.rows[0].count),
      approved: Number(approved.rows[0].count),
      pending: Number(pending.rows[0].count),
      rejected: Number(rejected.rows[0].count),
      flagged: Number(flagged.rows[0].count),
      totalAmount: Number(amount.rows[0].total)
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB Error" });
  }
};


export const getAllApplications = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM applications ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "DB Error" });
  }
};

//  DASHBOARD
export const getAdminDashboard = (req, res) => {
  res.json({ message: "Admin dashboard data" });
};


export const getAllReports = async (req, res) => {
  try {
    const total = await db.query("SELECT COUNT(*) FROM applications");
    const approved = await db.query("SELECT COUNT(*) FROM applications WHERE status='approved'");
    const pending = await db.query("SELECT COUNT(*) FROM applications WHERE status='pending'");
    const rejected = await db.query("SELECT COUNT(*) FROM applications WHERE status='rejected'");
   const flagged = await db.query(
  "SELECT COUNT(*) FROM applications WHERE LOWER(fraud) = 'fraud'"
);
    const totalAmount = await db.query("SELECT COALESCE(SUM(amount),0)  AS total FROM applications");
    const fraudAmount = await db.query(
  "SELECT COALESCE(SUM(amount),0) FROM applications WHERE LOWER(fraud) = 'fraud'"
);

    res.json({
      total: Number(total.rows[0].count),
      approved: Number(approved.rows[0].count),
      pending: Number(pending.rows[0].count),
      rejected: Number(rejected.rows[0].count),
      flagged: Number(flagged.rows[0].count),
      totalAmount: Number(totalAmount.rows[0].total),
      fraudAmount: Number(fraudAmount.rows[0].coalesce)
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Report Error" });
  }
};


export const getReportSummary = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT status, COUNT(*) 
      FROM applications 
      GROUP BY status
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Summary Error" });
  }
};

export const addRemark = async (req, res) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    return res.status(400).json({ message: "ID and remark required" });
  }

  try {
    await db.query(
      "UPDATE applications SET remark = $1 WHERE id = $2",
      [remark, id]
    );

    res.json({ message: "Remark saved" });
  } catch (err) {
    console.log("ADD REMARK ERROR:", err);
    res.status(500).json({ message: "DB Error" });
  }
};
export const getMonthlyReport = async (req, res) => {
  try {
   const result = await db.query(`
  SELECT 
    TO_CHAR(date::timestamp, 'YYYY-MM') AS month,
    COUNT(*) AS applications,  
    COUNT(*) FILTER (WHERE status = 'approved') AS approved,
    COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
    COUNT(*) FILTER (WHERE LOWER(fraud) = 'fraud') AS flagged
  FROM applications
  GROUP BY month
  ORDER BY month;
`);

    res.json(result.rows);

  } catch (err) {
    console.log("MONTHLY ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({ message: "Monthly report error" });
  }
};
export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      "UPDATE applications SET status=$1 WHERE id=$2",
      [status, id]
    );

    res.json({ message: "Status updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
};
export const getStats = async (req, res) => {
  try {
    
    const result = await db.query(`
  SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE status = 'approved') AS approved,
    COUNT(*) FILTER (WHERE status = 'pending') AS pending,
    COUNT(*) FILTER (WHERE LOWER(fraud) = 'fraud') AS flagged,
    COALESCE(SUM(amount), 0) AS total_amount
  FROM applications
`);
    

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Stats error" });
  }
};
export const getReports = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM applications");
    res.json(result.rows);
  } catch (err) {
    console.log("❌ REPORT ERROR:", err);
    res.status(500).json({ message: "Error fetching reports" });
  }
};