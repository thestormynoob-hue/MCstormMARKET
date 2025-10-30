// ----------- server.js -----------
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// کلید از Environment Variable در Render
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
  res.send("✅ Storm Gemini Server is running!");
});

app.post("/api/gemini", async (req, res) => {
  const prompt = req.body.prompt || "";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini raw:", JSON.stringify(data)); // برای تست در لاگ Render

    let reply = "❌ پاسخی از Gemini دریافت نشد.";

    if (data?.candidates?.length) {
      // حالت اصلی پاسخ
      const candidate = data.candidates[0];
      if (candidate?.content?.parts?.length) {
        reply = candidate.content.parts.map(p => p.text).join(" ");
      }
    } else if (data?.promptFeedback?.blockReason) {
      // اگر گوگل درخواست رو بلاک کرده
      reply = "گوگل درخواست را مسدود کرد (" + data.promptFeedback.blockReason + ")";
    } else if (data?.error?.message) {
      // اگر خطا از API برگشته
      reply = "خطا از Google API: " + data.error.message;
    }

    res.json({ reply });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ reply: "❌ خطا در ارتباط با Gemini!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Storm Gemini Server running on port ${PORT}`));
