// src/controllers/chatController.js

const { db } = require('../services/firebaseService');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatWithGroq = async (req, res) => {
    const userMessage = req.body.message;
    const userId = req.user.uid; 
    
    if (!userMessage) {
        return res.status(400).json({ message: "Mensagem vazia." });
    }

    try {
        // 1. CARREGAR HISTÓRICO
        const conversationRef = db.collection('conversations').doc(userId);
        const doc = await conversationRef.get();
        
        let messages = [
            { role: "system", content: "Você é o Chatbot Groq, um assistente rápido e útil. Responda de forma concisa e amigável." }
        ];

        if (doc.exists) {
            messages = messages.concat(doc.data().history || []);
        }
        
        messages.push({ role: "user", content: userMessage });


        // 2. CHAMADA À API do Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: messages.slice(-15), // Limita contexto
            model: "openai/gpt-oss-120b",
        });

        const iaResponse = chatCompletion.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";

        
        // 3. SALVAR NOVA INTERAÇÃO NO FIRESTORE
        const newUserMessageObj = { role: "user", content: userMessage, timestamp: new Date().toISOString() };
        const newIaMessageObj = { role: "assistant", content: iaResponse, timestamp: new Date().toISOString() };
        
        const updatedHistory = (doc.exists ? doc.data().history : []).concat([newUserMessageObj, newIaMessageObj]);

        await conversationRef.set({
            userId: userId,
            history: updatedHistory,
            lastUpdated: new Date().toISOString()
        });

        // 4. RETORNA a resposta da IA
        res.json({ response: iaResponse, history: updatedHistory });

    } catch (error) {
        console.error("Erro na API do Groq ou Firestore:", error);
        res.status(500).json({ message: "Erro na comunicação com o servidor." });
    }
};


const getConversationHistory = async (req, res) => {
    const userId = req.user.uid;
    try {
        const doc = await db.collection('conversations').doc(userId).get();
        if (doc.exists) {
            res.json({ history: doc.data().history });
        } else {
            res.json({ history: [] });
        }
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        res.status(500).json({ message: "Erro ao carregar o histórico." });
    }
};


module.exports = {
    chatWithGroq,
    getConversationHistory,
};