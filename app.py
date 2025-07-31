from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/assistente")
async def assistente(request: Request):
    body = await request.json()
    prompt = body.get("mensagem", "")

    if not prompt:
        return {"resposta": "Por favor, envie uma mensagem válida."}

    resposta = client.chat.completions.create(
        model="gpt-4o",  # ou "gpt-4"
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    return {"resposta": resposta.choices[0].message.content.strip()}
