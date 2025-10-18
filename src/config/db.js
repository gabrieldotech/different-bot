const mongoose = require("mongoose");
require("dotenv").config();

// Lê a URI de conexão (string de conexão) do arquivo .env
const DB_URI = process.env.DB_URI;

// Função para estabelecer a conexão
const connectDB = async () => {
  try {
    if (!DB_URI) {
      console.error(
        "ERRO FATAL: A variável de ambiente DB_URI não está definida no arquivo .env"
      );
      // Se a URI não existir, a aplicação não deve iniciar
      process.exit(1);
    }

    // Tenta conectar ao MongoDB
    await mongoose.connect(DB_URI);

    console.log(
      "✅ Conexão com o Banco de Dados (MongoDB) estabelecida com sucesso."
    );
  } catch (error) {
    console.error("❌ ERRO AO CONECTAR AO BANCO DE DADOS:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
