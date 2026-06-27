const express = require("express");
const router = express.Router();
const { chat, clearSession } = require("./ai.controller");
const { protect } = require("../../middleware/authMiddleware");

// All AI routes are protected — must be logged in
router.post("/chat", protect, chat);
router.delete("/session/:sessionId", protect, clearSession);

module.exports = router;