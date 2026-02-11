export default async function handler(req, res) {
  // Chỉ cho phép POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // Gọi Google Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Nếu Google trả lỗi
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Trả kết quả về frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}
