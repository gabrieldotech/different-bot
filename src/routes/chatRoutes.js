// src/routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController'); 
const { chatWithGroq, getConversationHistory } = require('../controllers/chatController'); 

// Rota POST para enviar mensagens ao chatbot, protegida por autenticação
router.post('/', protect, chatWithGroq);

// Rota GET para carregar o histórico ao abrir a página
router.get('/history', protect, getConversationHistory); 

module.exports = router;