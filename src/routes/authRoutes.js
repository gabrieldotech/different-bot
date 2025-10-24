// routes/authRoutes.js

const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();

// Rota POST para /api/auth/register
router.post("/register", registerUser);

// Rota POST para /api/auth/login
router.post("/login", loginUser);

module.exports = router;
