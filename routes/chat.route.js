// routes/chat.route.js
const express = require("express");
const router = express.Router();
const chatController = require("../controller/chat.controller");

// POST /ai/chat
router.post("/chat", chatController.chatWithGemini);

module.exports = router;
