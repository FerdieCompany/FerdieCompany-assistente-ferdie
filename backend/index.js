import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let conteudoFerdie = '';
try {
  conteudoFerdie = fs.readFileSync('./conteudo_ferdie_renderizado.json', 'utf8');
  console.log('📘 Conteúdo renderizado carregado com sucesso.');
} catch (erro) {
  console.error('Erro ao carregar o conteúdo renderizado:', erro);
}

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

"""${conteudoFerdie}"""

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
