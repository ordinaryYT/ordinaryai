export default async function handler(req, res) {
  const { model, prompt } = req.body;

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "API key missing." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const json = await response.json();
    const reply = json.choices?.[0]?.message?.content || "No response.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from OpenRouter." });
  }
}
