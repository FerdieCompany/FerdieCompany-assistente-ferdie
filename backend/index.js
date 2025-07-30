const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/assistente", async (req, res) => {
  const { pergunta } = req.body;
  if (!pergunta) {
    return res.status(400).json({ erro: "Pergunta não fornecida." });
  }

  try {
    const resposta = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é o Assistente Ferdie, um curador sensível de joias com alma. Responda com empatia e elegância.",
        },
        {
          role: "user",
          content: pergunta,
        },
      ],
    });

    res.json({ resposta: resposta.data.choices[0].message.content });
  } catch (erro) {
    console.error("Erro OpenAI:", erro.response?.data || erro.message);
    res.status(500).json({ erro: "Erro ao gerar resposta." });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Assistente Ferdie rodando em http://localhost:" + port);
});
