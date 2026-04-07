import express from "express";
import axios from "axios";


import { Application } from "../models/application.model.js";

import { Fraud } from "../models/fraud.model.js";
import { getMonthlyReport } from "../controllers/admin.controller.js";
import { updateStatus } from "../controllers/admin.controller.js";
import { getStats } from "../controllers/admin.controller.js";
import { getReports } from "../controllers/admin.controller.js";


import {
  getAdminDashboard,
  getAdminStats,
  getAllApplications,
  getAllReports,
  getReportSummary,
  addRemark,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Existing routes
router.get("/dashboard", getAdminDashboard);
router.get("/stats", getAdminStats);
router.get("/applications", getAllApplications);
router.get("/reports", getAllReports);
router.get("/report/summary", getReportSummary);
router.post("/add-remark", addRemark);
router.get("/report/monthly", getMonthlyReport);
router.put("/applications/:id", updateStatus);
router.get("/stats", getStats);
router.get("/reports", getReports);
router.post("/update-status", async (req, res) => {
  try {
    const { id, status } = req.body;

    const app = await Application.findByPk(id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ❌ Already final hai to change mat hone do
    if (app.status !== "pending") {
      return res.status(400).json({
        message: "Status already finalized"
      });
    }

    await Application.updateStatus(id, status);

    res.json({ message: "Status updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
});


router.get("/detect/:id", async (req, res) => {
  try {
    const appData = await Application.findByPk(req.params.id);

    if (!appData) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔥 AI CALL
    const response = await axios.post("http://127.0.0.1:5001/predict", {
  amount: appData.amount,
  scheme: appData.scheme,
  income: appData.income || 200000,
  previous_applications: appData.previous_applications || 1,
  age: appData.age || 30,
  duplicate_aadhaar: appData.duplicate_aadhaar || 0
});

    const result = response.data;

    // ✅ ONLY fraud me flagged
    if (result.isFraud && appData.status !== "flagged") {
      await Application.updateStatus(appData.id, "flagged");
    }

    // ✅ OPTIONAL: frauds table me save kar
    await Fraud.create({
      applicationId: appData.id,
      isFraud: result.isFraud,
      threat: result.threat,
      accuracy: result.accuracy
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI error" });
  }
});

export default router;