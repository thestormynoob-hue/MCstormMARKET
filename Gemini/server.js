// ----------- server.js -----------
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// کلید API از محیط Koyeb گرفته میشه
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// صفحه‌ی اصلی
app.get("/", (req, res) => {
  res.send("✅ Storm Gemini Server is running on Koyeb!");
});

// مسیر API اصلی برای چت با Gemini
app.post("/api/gemini", async (req, res) => {
  const prompt = req.body.prompt || "";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ پاسخی از Gemini دریافت نشد.";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ reply: "❌ خطا در ارتباط با Gemini!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Storm Gemini Server running on port ${PORT}`));
