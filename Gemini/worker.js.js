export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // فقط برای تست
    if (url.pathname === "/") {
      return new Response("✅ Storm Gemini Worker is running!", {
        headers: { "content-type": "text/plain" },
      });
    }

    // مسیر اصلی API
    if (url.pathname === "/api/gemini" && request.method === "POST") {
      try {
        const { prompt } = await request.json();
        const apiKey = env.GEMINI_API_KEY;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        const data = await response.json();
        const reply =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "❌ پاسخی از Gemini دریافت نشد.";

        return new Response(JSON.stringify({ reply }), {
          headers: { "content-type": "application/json" },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ reply: "❌ خطا در ارتباط با Gemini!" }),
          { headers: { "content-type": "application/json" }, status: 500 }
        );
      }
    }

    return new Response("❌ مسیر یافت نشد", { status: 404 });
  },
};
