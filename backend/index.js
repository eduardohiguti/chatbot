import express, { json } from 'express';
import cors from 'cors';
import { HLTV } from 'hltv';
const app = express();
const port = 8080;

app.use(cors());
app.use(json());

const furiaTeam = async () => {
    try {
        const team = await HLTV.getTeam({ id: 8297 });
        return `
            <div class="card-message">
                <img src="/furia.svg" alt="Logo da FURIA" style="width: 100px; display: block; margin: 0 auto 16px;" />
                <h3 style="text-align: center; font-family: sans-serif; font-size: 24px;">FURIA Esports</h3>
                <p style="text-align: center; font-family: sans-serif;">Ranking mundial: <strong>#${team.rank}</strong></p>
                <p style="font-weight: bold; margin-top: 10px;">Jogadores:</p>
                <ul style="padding-left: 20px; font-family: sans-serif;">
                    ${team.players.map((p) => `<li>${p.name}</li>`).join('')}
                </ul>
            </div>
        `;
    } catch (err) {
        return `Erro ao buscar informações da FURIA: ${err.message}`;
    }
};

const furiaNews = async () => {
    try {
        const team = await HLTV.getTeam({ id: 8297 });
        const news = team.news.slice(0, 5);
        return `Aqui está as ultimas 5 notícias da FURIA:\n\n${news.map(n => `📰 ${n.name}\n🔗 https://hltv.org${n.link}`).join('\n\n')}`
    } catch (err) {
        return `Erro ao buscar as notícias da FURIA: ${err.message}`;
    }
};
  
const saudacoes = ["oi", "ola", "bom dia", "boa tarde", "boa noite"];

const respostas = {
    "redes sociais": "Essas são as nossas redes sociais!\n\nX - https://x.com/furia\nInstagram - https://www.instagram.com/furiagg/\nTwitch - https://www.twitch.tv/furiatv",
    "site": "Aqui o link do nosso site oficial! https://www.furia.gg/",
    "ajuda": "Você pode perguntar sobre o time e sobre as notícias do time de CS da FURIA!"
};

function normalizar(mensagem) {
    return mensagem.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

app.post('/chat', async (req, res) => {
    const { mensagem } = req.body;
    const textoNormalizado = normalizar(mensagem);

    if (saudacoes.some(saudacao => textoNormalizado.includes(saudacao))) {
        return res.json({ resposta: "Olá, como posso ajudar?" });
    }

    if (textoNormalizado.includes("time") || (textoNormalizado.includes("furia"))) {
        const resposta = await furiaTeam();
        return res.json({ resposta });
    }

    if (textoNormalizado.includes("news") || (textoNormalizado.includes("noticias"))) {
        const resposta = await furiaNews();
        return res.json({ resposta });
    }

    const respostaEncontrada = Object.keys(respostas).find(chave => textoNormalizado.includes(chave));

    if (respostaEncontrada) {
        const resposta = respostas[respostaEncontrada];
        if (typeof resposta === 'function') {
            const conteudo = await resposta();
            return res.json({ resposta: conteudo });
        }
    
        return res.json({ resposta });
    } else {
        return res.json({ resposta: "Desculpe, não entendi." });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
});