// ----------- server.js -----------
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ کلید API از تنظیمات Render (Environment Variable)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// 🧠 مسیر تست سلامت سرور
app.get("/", (req, res) => {
  res.send("✅ Storm Gemini Server (v1beta, gemini-2.0-flash) is running!");
});

// 💬 مسیر اصلی چت Gemini
app.post("/api/gemini", async (req, res) => {
  const prompt = req.body.prompt || "";

  try {
    // 🚀 فراخوانی مدل رسمی گوگل (v1beta)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    // دریافت پاسخ از Gemini
    const data = await response.json();
    console.log("Gemini raw:", JSON.stringify(data)); // لاگ برای Render

    let reply = "❌ پاسخی از Gemini دریافت نشد.";

    if (data?.candidates?.length) {
      const candidate = data.candidates[0];
      if (candidate?.content?.parts?.length) {
        reply = candidate.content.parts.map(p => p.text).join(" ");
      }
    } else if (data?.error?.message) {
      reply = "خطا از Google API: " + data.error.message;
    }

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ reply: "❌ خطا در ارتباط با Gemini!" });
  }
});

// ⚙️ پورت اجرای Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Storm Gemini Server (v1beta) running on port ${PORT}`)
);
