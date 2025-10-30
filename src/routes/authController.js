// src/controllers/authController.js

const { admin } = require('../services/firebaseService'); // Importa o Admin SDK
const { Router } = require('express');

// 1. Middleware de Proteção (protect)
const protect = async (req, res, next) => {
  const idToken = req.cookies.firebaseToken;
  
  if (!idToken) {
    return res.redirect("/login");
  }
  
  try {
    // Verifica o token de sessão (Mais seguro que o ID Token bruto)
    const decodedToken = await admin.auth().verifySessionCookie(idToken, true);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token Firebase inválido ou expirado:", error.message);
    res.clearCookie("firebaseToken");
    res.redirect("/login");
  }
};

// 2. Lógica da Rota de Verificação de Sessão (verifyToken)
const verifyToken = async (req, res) => {
  const idToken = req.body.token;
  
  if (!idToken) {
    return res.status(400).send({ status: 'error', message: 'Token não fornecido.' });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias
  
  try {
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    res.cookie("firebaseToken", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    
    res.status(200).send({ status: 'success', message: 'Sessão criada com sucesso.' });
  } catch (error) {
    console.error("Erro ao criar cookie de sessão:", error);
    res.status(500).send({ status: 'error', message: 'Falha na sessão.' });
  }
};

module.exports = {
  protect,
  verifyToken,
};