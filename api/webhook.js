// /api/webhook.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Mensagem vazia." });
    }

    const prompt = `
Você é um atendente virtual de uma loja.
Responda curto, direto e simpático.

Pergunta: ${message}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(prompt);

    const texto = result.response.text();

    return res.status(200).json({
      reply: texto
    });

  } catch (error) {

    console.error("Erro webhook:", error);

    return res.status(500).json({
      reply: "Erro ao gerar resposta da IA."
    });

  }

}
