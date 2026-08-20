// Esse arquivo vai em /api/gemini.js
import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt inválido" });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message.content;

    res.status(200).json({ text });
  } catch (error) {
    console.error("Erro na API Groq:", error);
    res.status(500).json({ error: "Erro ao gerar resposta" });
  }
}
