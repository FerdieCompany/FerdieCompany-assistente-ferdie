# Assistente Ferdie (Node.js)

Este é o backend do Assistente Ferdie, um curador virtual de joias com alma.

## Como usar

1. Instale as dependências:
```
npm install
```

2. Crie um arquivo `.env` com sua chave da OpenAI:
```
OPENAI_API_KEY=sua-chave-aqui
```

3. Inicie o servidor:
```
npm start
```

4. Acesse via POST em:
```
/assistente
```

---

## Para deploy no Render

- Use esse repositório no GitHub
- Configure a variável de ambiente:
  - `OPENAI_API_KEY`
