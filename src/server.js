// server.js

const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

// Inicializa o Firebase Admin via serviço (Isso também verifica o .env)
const { admin } = require('./services/firebaseService'); 

// Importa o middleware de proteção e os routers
const { protect } = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ----------------------------------------------------
// 1. ROTAS DE API
// ----------------------------------------------------
app.use("/api/auth", authRoutes); // Rota de verificação de token
app.use("/api/chat", chatRoutes); // Rota de chat (Groq e Firestore)

// ----------------------------------------------------
// 2. ROTAS DE VIEW
// ----------------------------------------------------
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  // Passa as variáveis de ambiente necessárias para o login.ejs
  res.render("login", { 
      process: { env: {
          FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
          FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
          FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
          FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
          FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
          FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      }}
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("firebaseToken");
  res.redirect("/login");
});

app.get("/chat", protect, (req, res) => {
  // O middleware 'protect' garante que req.user exista
  const username = req.user.name || req.user.email; 
  res.render("chat", { username: username });
});

app.get("/register", (req, res) => {
  res.render("register"); 
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});