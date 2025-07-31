from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import json
import os

app = Flask(__name__)
CORS(app)

# Configuração da API Key
openai.api_key = os.getenv("OPENAI_API_KEY")  # Usa a variável de ambiente

# Carrega o conteúdo real do site a partir do arquivo JSON
with open("conteudo_ferdie.json", "r", encoding="utf-8") as f:
    conteudo_ferdie = json.load(f)

# Transforma os textos do JSON em um contexto utilizável pelo GPT
def gerar_contexto(conteudo):
    contexto = ""
    for pagina, dados in conteudo.items():
        if isinstance(dados, str):
            contexto += f"\n[{pagina.upper()}]\n{dados.strip()}"
        elif isinstance(dados, dict):
            for subsecao, texto in dados.items():
                contexto += f"\n[{pagina.upper()} - {subsecao.upper()}]\n{texto.strip()}"
    return contexto

contexto_base = gerar_contexto(conteudo_ferdie)

@app.route("/assistente", methods=["POST"])
def assistente():
    data = request.get_json()
    pergunta = data.get("pergunta", "").strip()

    if not pergunta:
        return jsonify({"erro": "Pergunta não fornecida."}), 400

    try:
        resposta = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Você é o Assistente Ferdie, um assistente sensível, empático e elegante da marca Ferdie. "
                        "Use apenas o conteúdo abaixo como base para responder às perguntas dos clientes. "
                        "Indique produtos reais do site Ferdie quando possível, como joias específicas, coleções, descrições ou instruções. "
                        "Nunca invente produtos. Seja sempre cordial, refinado e encantador.\n\n"
                        f"{contexto_base}"
                    )
                },
                {
                    "role": "user",
                    "content": pergunta
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )
        resposta_texto = resposta.choices[0].message["content"]
        return jsonify({"resposta": resposta_texto})
    
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
