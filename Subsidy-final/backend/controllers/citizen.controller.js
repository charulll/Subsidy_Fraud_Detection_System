import { db } from "../config/db.js";
import axios from "axios";

export const getDashboard = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'approved') AS approved,
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE fraud = 'fraud') AS flagged
      FROM applications
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};

/* All applications (admin side) */
export const getApplications = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM applications ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "DB Error" });
  }
};

/* Citizen specific applications */
export const getCitizenApplications = async (req, res) => {
  const { aadhaar } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM applications WHERE citizen_aadhaar = $1 ORDER BY id DESC",
      [aadhaar]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "DB Error" });
  }
};

/* Apply for subsidy */
export const applySubsidy = async (req, res) => {
  const { aadhaar, scheme, amount, bankAccount, ifscCode, income } = req.body;
  const date = new Date().toISOString().split("T")[0];

  if (!aadhaar || !scheme || !amount || !income) {
    return res.status(400).json({ message: "All fields required" });
  }
  if (!/^\d{9,18}$/.test(bankAccount)) {
  return res.status(400).json({
    message: "Bank account number must be 9 to 18 digits"
  });
}
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
    return res.status(400).json({
      message: "Invalid IFSC code format"
    });
  }
  try{
  let fraudResult;
  //  CHECK DUPLICATE AADHAAR
const existingAadhaar = await db.query(
  "SELECT COUNT(*) FROM applications WHERE citizen_aadhaar=$1",
  [aadhaar]
);

const isDuplicateAadhaar = existingAadhaar.rows[0].count > 0;
//  CHECK DUPLICATE BANK ACCOUNT
const existingBank = await db.query(
  "SELECT COUNT(*) FROM applications WHERE bank_account=$1",
  [bankAccount]
);

const isDuplicateBank = existingBank.rows[0].count > 0;
  try {
    const response = await axios.post("http://127.0.0.1:5001/predict", {
    amount,
    scheme,
    income: income,
    previous_applications: 1,
    age: 30,
    duplicate_aadhaar: isDuplicateAadhaar ? 1 : 0
  });
   console.log("ML SUCCESS:", response.data);
  fraudResult = response.data;
  if (isDuplicateAadhaar) {
  fraudResult.reasons.push("Same Aadhaar used multiple times");
}

if (isDuplicateBank) {
  fraudResult.reasons.push("Same bank account used in multiple applications");
}
if (isDuplicateAadhaar || isDuplicateBank) {
  fraudResult.isFraud = true;
  fraudResult.threat = "High";
}

} catch (err) {
  console.log("ML ERROR FULL:", err);

  fraudResult = {
    isFraud: false,
    threat: "Low",
    accuracy: "0%",
    reasons: ["ML not working"]
}};

    const result = await db.query(
  `INSERT INTO applications 
(citizen_aadhaar, scheme, amount, status, fraud, threat, accuracy, reason,  bank_account, ifsc_code, date)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
   RETURNING id`,
  [
  aadhaar,
  scheme,
  amount,
  fraudResult.threat === "High" ? "rejected" : "pending",
  fraudResult.isFraud ? "Fraud" : "Safe",
  fraudResult.threat,
  fraudResult.accuracy,
  fraudResult.reasons.join(", "),
  bankAccount,
  ifscCode
]
);

    res.json({
      message: "Application submitted",
      applicationId: result.rows[0].id,
    });
  }catch (err) {
  console.log("REAL ERROR:", err);   
  res.status(500).json({ message: "Insert failed" });
}
};
export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      "UPDATE applications SET status = $1 WHERE id = $2",
      [status, id]
    );

    res.json({ message: "updated" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "update failed" });
  }
};
