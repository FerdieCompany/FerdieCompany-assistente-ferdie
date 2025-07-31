const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar a chave da OpenAI a partir da variável de ambiente
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(bodyParser.json());

// Carrega o conteúdo do JSON uma vez ao iniciar
let conteudoFerdie = "";
try {
  const rawData = fs.readFileSync("conteudo_ferdie.json", "utf8");
  const jsonData = JSON.parse(rawData);

  conteudoFerdie = Object.values(jsonData)
    .map(secao => secao.titulo + "\n" + secao.texto)
    .join("\n\n");
} catch (err) {
  console.error("Erro ao carregar o conteúdo Ferdie:", err);
  conteudoFerdie = "";
}

// Rota principal
app.post("/assistente", async (req, res) => {
  const mensagem = req.body.mensagem;

  if (!mensagem) {
    return res.status(400).json({ resposta: "Mensagem ausente." });
  }

  try {
    const prompt = `
Você é o Assistente Ferdie, um curador sensível e poético da joalheria Ferdie.
Abaixo está o conteúdo real do site da marca. Use esse conteúdo como base para responder com empatia e sofisticação ao cliente.

CONTEÚDO DO SITE:
${conteudoFerdie}

Agora, responda à seguinte pergunta do cliente com base nesse conteúdo:

"${mensagem}"
`;

    const respostaIA = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Você é um assistente sensível e sofisticado da joalheria Ferdie." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const resposta = respostaIA.data.choices[0].message.content.trim();
    res.json({ resposta });
  } catch (error) {
    console.error("Erro ao gerar resposta:", error.message);
    res.status(500).json({ resposta: "Desculpe, houve um erro ao responder." });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Assistente Ferdie rodando em http://localhost:${PORT}`);
});
