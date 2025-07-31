import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Carregando conteúdo do site
const conteudoFerdie = require('./conteudo_ferdie_renderizado.json');
console.log('📘 Conteúdo renderizado carregado com sucesso.');

app.post('/assistente', async (req, res) => {
  const mensagemUsuario = req.body.mensagem;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
Você é o Assistente Ferdie, um especialista sensível e empático que ajuda pessoas a escolherem joias no site da Ferdie. 
Você responde com gentileza, sensibilidade e linguagem poética quando necessário.

Use apenas o conteúdo a seguir como referência (conteúdo do site Ferdie):

"""${JSON.stringify(conteudoFerdie)}"""

Se a resposta não estiver no conteúdo, diga com suavidade que não encontrou.
`
        },
        {
          role: 'user',
          content: mensagemUsuario
        }
      ],
      model: 'gpt-4o',
      temperature: 0.7
    });

    const resposta = chatCompletion.choices[0].message.content;
    res.json({ resposta });
  } catch (erro) {
    console.error('Erro na geração da resposta:', erro);
    res.status(500).json({ resposta: 'Desculpe, houve um erro ao gerar a resposta.' });
  }
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`✨ Assistente Ferdie online em http://localhost:${PORTA}`);
});
