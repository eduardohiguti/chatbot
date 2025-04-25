const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const saudacoes = ["oi", "ola", "bom dia", "boa tarde", "boa noite"];

const respostas = {
    "adidas": "Para ver nossa parceria com a Adidas acesse o link: https://adidas.furia.gg/",
    "redes sociais": "Essas são as nossas redes sociais\nX - https://x.com/furia\nInstagram - https://www.instagram.com/furiagg/\nTwitch - https://www.twitch.tv/furiatv",
    "site": "Aqui o link do nosso site oficial! https://www.furia.gg/",
    "time": "Aqui você encontrará as informações do nosso time de CS! - https://www.hltv.org/team/8297/furia",
    "ajuda": "Você pode perguntar sobre: sobre o nosso site, nossa parceria com a adidas, nossas redes sociais, informações sobre o nosso time de CS ou apenas dar um oi! Caso precise entrar em contato conosco, acesse esse link https://api.whatsapp.com/send?l=pt&phone=5511945128297&text=Poderia%20me%20ajudar?",
    "sobre": "Somos FURIA. Uma organização de esports que nasceu do desejo de representar o Brasil no CS e conquistou muito mais que isso: expandimos nossas ligas, disputamos os principais títulos, adotamos novos objetivos e ganhamos um propósito maior. Somos muito mais que o sucesso competitivo.\nSomos um movimento sociocultural.\nNossa história é de pioneirismo, grandes conquistas e tradição. Nosso presente é de desejo, garra e estratégia. A pantera estampada no peito estampa também nosso futuro de glória. Nossos pilares de performance, lifestyle, conteúdo, business, tecnologia e social são os principais constituintes do movimento FURIA, que representa uma unidade que respeita as individualidades e impacta positivamente os contextos em que se insere. Unimos pessoas e alimentamos sonhos dentro e fora dos jogos.",
    "faq": "No nosso site você consegue encontrar todas as perguntas frequentes que recebemos! https://www.furia.gg/faq",
    "troca": "No nosso site você consegue encontrar nossas políticas de troca! https://www.furia.gg/trocas-devolucoes",
    "devolução": "No nosso site você consegue encontrar nossas políticas de devolução! https://www.furia.gg/trocas-devolucoes",
    "pagamento": "No nosso site você consegue encontrar as formas de pagamento disponíveis na nossa loja! https://www.furia.gg/formas-pagamento"
};

function normalizar(mensagem) {
    return mensagem.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

app.post('/chat', (req, res) => {
    const { mensagem } = req.body;
    const textoNormalizado = normalizar(mensagem);

    if (saudacoes.some(saudacao => textoNormalizado.includes(saudacao))) {
        return res.json({ resposta: "Olá, como posso ajudar?" });
    }

    const respostaEncontrada = Object.keys(respostas).find(chave => textoNormalizado.includes(chave));
    res.json({ resposta: respostas[respostaEncontrada] || "Desculpe, não entendi. escreva 'ajuda' para mais informações!" });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
});