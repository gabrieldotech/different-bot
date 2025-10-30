// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authController');

// Rota POST para receber o token do frontend e criar o cookie de sessão no backend
router.post('/verify', verifyToken);

module.exports = router;