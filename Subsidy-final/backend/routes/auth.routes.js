import express from "express";
import { sendOtp, verifyOtp, adminLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/citizen/send-otp", sendOtp);
router.post("/citizen/verify-otp", verifyOtp);
router.post("/admin/login", adminLogin);

export default router;
