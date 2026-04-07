import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import chatbotRoutes from "./routes/chatbot.routes.js";
import authRoutes from "./routes/auth.routes.js";
import citizenRoutes from "./routes/citizen.routes.js";
import adminRoutes from "./routes/admin.routes.js"; 

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chatbot", chatbotRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Subsidy Backend is Running 🚀");
});

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
