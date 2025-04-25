#  Chatbot FURIA Esports - Documentação

##  Visão Geral

Esse projeto é um **chatbot interativo** que responde perguntas sobre o time de CS:GO da **FURIA Esports**. Ele busca informações diretamente do site da HLTV usando a biblioteca `hltv`.

O bot pode responder sobre:

- Time atual da FURIA
- Últimas partidas
- Estatísticas da equipe
- Notícias recentes
- Line-up e jogadores históricos
- Links úteis (site, redes sociais)

---

##  Tecnologias Utilizadas

### Backend (Node.js):
- `express`
- `cors`
- `hltv` (API não oficial do HLTV.org)

### Frontend (React + TypeScript):
- `axios`

---

##  Como Rodar o Projeto

###  Backend

```bash
npm install express cors hltv
node index.js
```

Servidor disponível em: `http://localhost:8080`

###  Frontend

Assumindo que esteja dentro de um projeto React + Typescript:

```bash
npm install axios
npm run dev
```

---

##  Rotas da API

### `POST /chat`

Recebe uma mensagem e retorna uma resposta do bot.

**Request:**
```json
{
  "mensagem": "noticias da furia"
}
```

**Response:**
```json
{
  "resposta": "<div class='card-message'>...resposta formatada...</div>"
}
```

---

##  Inteligência do Bot

### Respostas baseadas em palavras-chave:
- `"oi", "ola", "bom dia"` → Saudacão
- `"time", "furia"` → Informações do time
- `"noticias", "news"` → Últimas 5 notícias da FURIA
- `"stats", "estatisticas"` → Estatísticas da equipe
- `"players", "jogadores"` → Line-up atual, stand-ins, históricos
- `"partidas", "matches"` → Últimos 5 jogos
- `"ajuda"` → Explica comandos disponíveis
- `"site", "redes sociais"` → Links úteis

---

##  Chat Interativo (Frontend)

### Exemplo de componente:

```tsx
<Message sender="bot" text="<h3>Estatísticas da FURIA</h3>..." />
```

- Interface `Message` define quem enviou e o texto.
- Bot simula "digitando..." com um `setTimeout`.
- Estilo do chat está em `Chat.css`.
