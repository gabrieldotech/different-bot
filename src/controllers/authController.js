// controllers/authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Função Auxiliar: Cria o token JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, preencha todos os campos." });
  }

  try {
    // A criptografia é feita no models/User.js (pre('save'))
    const user = await User.create({ username, email, password });

    const token = createToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: token,
      message: "Registro realizado com sucesso!",
    });
  } catch (error) {
    // Erro 11000 = Chave única duplicada (Email ou Username já existem)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Usuário ou E-mail já registrado." });
    }
    res.status(500).json({
      message: "Erro no servidor durante o registro.",
      details: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, preencha E-mail e Senha." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Usa o método matchPassword do models/User.js para comparar hashes
    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      const token = createToken(user._id);

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
        message: "Login bem-sucedido!",
      });
    } else {
      res.status(401).json({ message: "Credenciais inválidas." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor durante o login.",
      details: error.message,
    });
  }
};
