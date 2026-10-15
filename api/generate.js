const MODEL = "gemini-3.8-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration is missing GEMINI_API_KEY. Add it in Vercel Project Settings → Environment Variables." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const allowedTopics = new Set(["Quadratic equations", "Pythagorean theorem", "Derivatives"]);
    const topic = allowedTopics.has(body.topic) ? body.topic : "Quadratic equations";
    const coreTask = typeof body.coreTask === "string" ? body.coreTask.slice(0, 1500).trim() : "";
    const language = body.language === "Russian" ? "Russian" : "English";

    const prompt = `You are an expert mathematics teacher designing differentiated learning.
Create three versions of ONE core mathematical concept/task about: ${topic}.
${coreTask ? `Use this user-provided core task as the starting point: ${coreTask}` : "Create a clear, self-contained core task for this topic."}
Language for all content: ${language}.
Return ONLY valid JSON with exactly this structure:
{"level1":{"problem":"...","hint":"...","solution":"..."},"level2":{"problem":"...","hint":"...","solution":"..."},"level3":{"problem":"...","hint":"...","solution":"..."}}
Requirements:
- Level 1 Foundation: simplify context and numbers where useful, break down the method into guided steps, and give a direct hint.
- Level 2 Standard: a grade-level problem, independent solving, and a strategic hint that does not reveal the full answer.
- Level 3 Advanced: a multi-step extension, proof, or realistic application requiring deeper reasoning.
- Keep all three levels connected to the same concept. Solutions must be mathematically correct and step-by-step enough for learning.
- Each problem, hint, and solution must be a plain string. Avoid markdown tables. Escape JSON characters correctly.`;

    const upstream = await fetch(`${API_BASE}${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.4 }
      })
    });

    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = payload?.error?.message || "Unknown error from Gemini.";
      const code = upstream.status === 400 || upstream.status === 403 || upstream.status === 404 || upstream.status === 429 ? upstream.status : 502;
      const friendly = code === 404
        ? `Gemini model or endpoint not found. Check model availability for this API key. Details: ${message}`
        : code === 403
        ? `Gemini API access denied. Check API key restrictions and project access. Details: ${message}`
        : code === 400
        ? `Gemini rejected the request. Check the API key, model access, and request settings. Details: ${message}`
        : code === 429
        ? `Gemini request limit reached. Try again later. Details: ${message}`
        : `Gemini request failed. Details: ${message}`;
      return res.status(code).json({ error: friendly });
    }

    const text = payload?.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("");
    if (!text) return res.status(502).json({ error: "Gemini returned no text. Try again." });
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    let data;
    try { data = JSON.parse(cleaned); }
    catch (_) { return res.status(502).json({ error: "Gemini returned invalid JSON. Click Generate again." }); }

    for (const level of ["level1", "level2", "level3"]) {
      if (!data[level] || !["problem", "hint", "solution"].every(key => typeof data[level][key] === "string" && data[level][key].trim())) {
        return res.status(502).json({ error: "Gemini returned an incomplete response. Click Generate again." });
      }
    }
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Generation error:", error);
    return res.status(500).json({ error: "Server error while generating the task. Check the Vercel function logs." });
  }
};
