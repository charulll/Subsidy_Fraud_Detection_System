import https from "https";
import axios from "axios";
import { db } from "../config/db.js";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Store OTP session data temporarily
// aadhaar -> { sessionId, name, phone, mode }
let otpStore = {};

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  const { aadhaar, name, phone, mode } = req.body;

  if (!aadhaar || !phone || !mode) {
    return res.status(400).json({
      message: "Aadhaar, phone and mode required",
    });
  }

  if (aadhaar.length !== 12 || phone.length !== 10) {
    return res.status(400).json({
      message: "Invalid Aadhaar or phone number",
    });
  }

  try {
    /* 1️⃣ Aadhaar–phone consistency check */
    const aadhaarCheck = await db.query(
      "SELECT phone FROM citizens WHERE aadhaar = $1",
      [aadhaar]
    );

    if (
      aadhaarCheck.rows.length > 0 &&
      aadhaarCheck.rows[0].phone !== phone
    ) {
      return res.status(400).json({
        message: "This Aadhaar is already linked with another mobile number",
      });
    }

    /* 2️⃣ Login / Register rules */
    const existing = await db.query(
      "SELECT * FROM citizens WHERE aadhaar = $1 OR phone = $2",
      [aadhaar, phone]
    );

    if (mode === "register" && existing.rows.length > 0) {
      return res.status(400).json({
        message: "Citizen already registered. Please login.",
      });
    }

    if (mode === "login" && existing.rows.length === 0) {
      return res.status(400).json({
        message: "Citizen not registered. Please register first.",
      });
    }

    /* 3️⃣ Send OTP via 2Factor (AUTOGEN) */
    const url = `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/${phone}/AUTOGEN`;
    const response = await axios.get(url, { httpsAgent });

    if (!response.data || response.data.Status !== "Success") {
      return res.status(400).json({
        message: response.data?.Details || "OTP not sent",
      });
    }

    /* 4️⃣ Store sessionId */
    otpStore[aadhaar] = {
      sessionId: response.data.Details,
      name,
      phone,
      mode,
    };

    res.json({
      masked: "XXXX-XXXX-" + aadhaar.slice(-4),
    });
  } catch (err) {
    console.error("SEND OTP ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  const { aadhaar, otp } = req.body;
  const record = otpStore[aadhaar];

  if (!record) {
    return res.status(401).json({ message: "OTP session expired" });
  }

  try {
    /* 1️⃣ Verify OTP with 2Factor */
    const verifyUrl = `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/VERIFY/${record.sessionId}/${otp}`;
    const verifyRes = await axios.get(verifyUrl, { httpsAgent });

    if (!verifyRes.data || verifyRes.data.Status !== "Success") {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const { name, phone, mode } = record;

    /* 2️⃣ LOGIN */
    if (mode === "login") {
      const result = await db.query(
        "SELECT * FROM citizens WHERE aadhaar = $1",
        [aadhaar]
      );

      const user = result.rows[0];
      delete otpStore[aadhaar];

      return res.json({
        token: "citizen-token",
        user: {
          name: user.name,
          aadhaarLast4: aadhaar.slice(-4),
        },
      });
    }

    /* 3️⃣ REGISTER */
    const insert = await db.query(
      "INSERT INTO citizens (aadhaar, name, phone) VALUES ($1,$2,$3) RETURNING *",
      [aadhaar, name, phone]
    );

    delete otpStore[aadhaar];

    res.json({
      token: "citizen-token",
      user: {
        name: insert.rows[0].name,
        aadhaarLast4: aadhaar.slice(-4),
      },
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ================= ADMIN LOGIN ================= */
export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@subsidyportal.gov.in" && password === "Admin@123") {
    return res.json({
      token: "admin-token",
      user: { name: "System Admin", role: "admin" },
    });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
};
