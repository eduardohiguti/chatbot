import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        setIsTyping(true);

        const timeout = setTimeout(() => {
            const mensagemBoasVindas: Message = {
                sender: 'bot',
                text: 'Olá! Seja bem-vindo. Me pergunte algo, ou escreva "ajuda" pra ver o que posso fazer!',
            };
            setMessages([mensagemBoasVindas]);
            setIsTyping(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await axios.post('http://localhost:8080/chat', { mensagem: input }, {
                headers: { 'Content-Type': 'application/json' },
            });

            setTimeout(() => {
                const botMessage: Message = { sender: 'bot', text: response.data.resposta };
                setMessages((prev) => [...prev, botMessage]);
                setIsTyping(false);
            }, 800);
        } catch (error) {
            console.error('Erro ao se comunicar com o servidor:', error);
            setIsTyping(false);
        }
    };

    const formatMessage = (text: string) => {
        if (typeof text !== 'string') return '';
    
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const html = text
            .replace(urlRegex, (url) => {
                if (url.match(/\.(jpeg|jpg|gif|png|svg)$/)) {
                    return `<img src="${url}" alt="imagem" style="max-width: 200px;" />`;
                }
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            })
            .replace(/\n/g, '<br>');
    
        return html;
    };
    
    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                    />

                ))}
                {isTyping && (
                    <div className="message bot">
                        FURIA está digitando<span className="dots">...</span>
                    </div>
                )}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua mensagem..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default Chat;