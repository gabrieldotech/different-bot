// src/services/firebaseService.js

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Configuração do Firebase Admin SDK
try {
  const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
  
  if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
    console.error("ERRO FATAL: Arquivo serviceAccountKey.json não encontrado. Verifique seu .env e o caminho.");
    process.exit(1);
  }
  
  // Resolve o caminho absoluto e carrega o arquivo de credenciais
  const serviceAccount = require(path.resolve(serviceAccountPath)); 
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin SDK inicializado.");
} catch (error) {
  console.error("❌ ERRO AO INICIALIZAR FIREBASE ADMIN:", error.message);
  process.exit(1);
}

// Inicializa o Firestore
const db = admin.firestore();

// Exporta o Admin SDK e a referência do Banco de Dados
module.exports = {
    admin, // O objeto Admin SDK principal
    db // A referência do Firestore
};