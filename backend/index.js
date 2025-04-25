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
        return `Erro ao buscar informações da FURIA: \n${err.message}`;
    }
};

const furiaNews = async () => {
    try {
        const team = await HLTV.getTeam({ id: 8297 });
        const news = team.news.slice(0, 5);
        return `Aqui está as ultimas 5 notícias da FURIA:\n\n${news.map(n => `📰 ${n.name}\n🔗 https://hltv.org${n.link}`).join('\n\n')}`
    } catch (err) {
        return `Erro ao buscar as notícias da FURIA: \n${err.message}`;
    }
};

const furiaStats = async () => {
    try {
        const stats = await HLTV.getTeamStats({ id: 8297 });

        return `
            <div class="card-message">
                <h3 style="text-align: center; font-family: sans-serif; font-size: 24px;">Estatísticas da FURIA</h3>
                <ul style="padding-left: 20px; font-family: sans-serif;">
                    <li><strong>Mapas jogados:</strong> ${stats.overview.mapsPlayed}</li>
                    <li><strong>Vitórias:</strong> ${stats.overview.wins}</li>
                    <li><strong>Empates:</strong> ${stats.overview.draws}</li>
                    <li><strong>Derrotas:</strong> ${stats.overview.losses}</li>
                    <li><strong>Total de kills:</strong> ${stats.overview.totalKills}</li>
                    <li><strong>Total de mortes:</strong> ${stats.overview.totalDeaths}</li>
                    <li><strong>Rounds jogados:</strong> ${stats.overview.roundsPlayed}</li>
                    <li><strong>Relação K/D:</strong> ${stats.overview.kdRatio}</li>
                </ul>
            </div>
        `;
    } catch (err) {
        return `Erro ao buscar as estatísticas da FURIA: \n${err.message}`;
    }
}

const furiaPlayers = async () => {
    try {
        const stats = await HLTV.getTeamStats({ id: 8297 });

        const lineup = stats.currentLineup.map(p => `- ${p.name}`).join('<br>');
        const historic = stats.historicPlayers.map(p => `- ${p.name}`).join('<br>');
        const standins = stats.standins.map(p => `- ${p.name}`).join('<br>');
        const substitutes = stats.substitutes.map(p => `- ${p.name}`).join('<br>');

        return `
            <div class="card-message">
                <h3 style="text-align: center; font-family: sans-serif;">Jogadores da FURIA</h3>
                <p><strong>Line-up atual:</strong><br>${lineup}</p>
                <p><strong>Históricos:</strong><br>${historic}</p>
                <p><strong>Stand-ins:</strong><br>${standins}</p>
                <p><strong>Substitutos:</strong><br>${substitutes}</p>
            </div>
        `;
    } catch (err) {
        return `Erro ao buscar os jogadores da FURIA: \n${err.message}`;
    }
};

const furiaMatches = async () => {
    try {
        const team = await HLTV.getTeamStats({ id: 8297 });
        const matches = team.matches.slice(0, 5);

        const partidasHTML = matches.map(match => {
            const data = new Date(match.date).toLocaleDateString();
            const adversario = match.team1.name === 'FURIA' ? match.team2.name : match.team1.name;
            const resultado = `${match.result.team1} x ${match.result.team2}`;
            const mapa = match.map;
            const evento = match.event.name;

            return `
                <div style="border: 1px solid #ccc; border-radius: 8px; padding: 12px; margin-bottom: 12px; background-color: #fff;">
                    <strong>Evento:</strong> ${evento}<br>
                    <strong>Data:</strong> ${data}<br>
                    <strong>Adversário:</strong> ${adversario}<br>
                    <strong>Mapa:</strong> ${mapa}<br>
                    <strong>Resultado:</strong> ${resultado}
                </div>
            `;
        }).join('');

        return `
            <div class="card-message">
                <h3 style="text-align: center;">Últimas 5 partidas da FURIA</h3>
                ${partidasHTML}
            </div>
        `;
    } catch (err) {
        return `Erro ao buscar as partidas da FURIA: \n${err.message}`;
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

    if (textoNormalizado.includes("stats") || (textoNormalizado.includes("estatisticas"))) {
        const resposta = await furiaStats();
        return res.json({ resposta });
    }

    if (textoNormalizado.includes("players") || (textoNormalizado.includes("jogadores"))) {
        const resposta = await furiaPlayers();
        return res.json({ resposta });
    }

    if (textoNormalizado.includes("partidas") || (textoNormalizado.includes("matches"))) {
        const resposta = await furiaMatches();
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