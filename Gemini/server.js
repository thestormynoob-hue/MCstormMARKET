// ----------- server.js -----------
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// کلید API از Environment Variables گرفته می‌شود (در Render تنظیمش کردی)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// تست سلامت سرور
app.get("/", (req, res) => {
  res.send("✅ Storm Gemini Server (v1beta) is running!");
});

// مسیر اصلی برای چت
app.post("/api/gemini", async (req, res) => {
  const prompt = req.body.prompt || "";

  try {
    // آدرس مخصوص API نسخه v1beta
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
          candidateCount: 1
        })
      }
    );

    const data = await response.json();
    console.log("Gemini raw:", JSON.stringify(data));

    // گرفتن پاسخ از API
    let reply = "❌ پاسخی از Gemini دریافت نشد.";

    if (data?.candidates?.length) {
      reply = data.candidates[0].output || data.candidates[0].content || reply;
    } else if (data?.error?.message) {
      reply = "خطا از Google API: " + data.error.message;
    }

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ reply: "❌ خطا در ارتباط با Gemini!" });
  }
});

// پورت پیش‌فرض Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Storm Gemini Server (v1beta) running on port ${PORT}`));
