// ----------- server.js -----------
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ❗ نکته مهم:
// هیچ‌وقت کلید API رو مستقیم نذار (مثل این پایین).
// Render اجازه می‌ده API key رو در محیط امن (Environment Variables) ذخیره کنی.
// فعلاً برای تست موقت، اینجا بنویس ولی بعداً باید حذفش کنی.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyAUWACaMmkve8aKr-viKgYq3xyuCcy3GXg";

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
