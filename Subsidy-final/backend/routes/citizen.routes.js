import express from "express";
import { getDashboard, getApplications } from "../controllers/citizen.controller.js";
import { getCitizenApplications } from "../controllers/citizen.controller.js";
import { applySubsidy } from "../controllers/citizen.controller.js";




const router = express.Router();

router.get("/dashboard", getDashboard);
router.get("/applications", getApplications);
router.get("/applications/:aadhaar", getCitizenApplications);
router.post("/apply", applySubsidy);

export default router;