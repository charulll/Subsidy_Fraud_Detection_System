import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for a Government Subsidy Fraud Detection Portal. Answer questions about subsidy schemes, eligibility, documents, fraud detection and application process."
        },
        {
          role: "user",
          content: message
        }
      ],
     model: "llama-3.1-8b-instant"
    });

    const reply = chatCompletion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.json({ reply: "AI service error. Please try again." });
  }
});

export default router;