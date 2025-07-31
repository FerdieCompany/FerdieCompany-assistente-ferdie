import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let conteudoSite = "";
try {
  conteudoSite = fs.readFileSync("./conteudo_ferdie_renderizado.json", "utf8");
  console.log("✅ Conteúdo renderizado carregado com sucesso.");
} catch (erro) {
  console.error("Erro ao ler o conteúdo do site:", erro);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/assistente", async (req, res) => {
  const mensagem = req.body.mensagem;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é o Assistente Ferdie, sensível e empático. Responda com base neste conteúdo real do site Ferdie:\n\n${conteudoSite}`,
        },
        {
          role: "user",
          content: mensagem,
        },
      ],
      temperature: 0.8,
    });

    const resposta = completion.choices[0]?.message?.content || "Desculpe, não consegui entender.";
    res.json({ resposta });
  } catch (erro) {
    console.error("Erro ao gerar resposta:", erro);
    res.status(500).json({ resposta: "Desculpe, houve um erro ao responder." });
  }
});

app.listen(PORT, () => {
  c
