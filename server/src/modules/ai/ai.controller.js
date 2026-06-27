const { getGeminiModel } = require("../../config/gemini");

// Store chat sessions in memory (per user)
// For production: use Redis or MongoDB
const chatSessions = new Map();

const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id.toString();

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const model = getGeminiModel();
    const sessionKey = `${userId}_${sessionId || "default"}`;

    // Get or create chat session (preserves history)
    if (!chatSessions.has(sessionKey)) {
      chatSessions.set(sessionKey, model.startChat({ history: [] }));
    }

    const chatSession = chatSessions.get(sessionKey);
    const result = await chatSession.sendMessage(message.trim());
    const reply = result.response.text();

    return res.status(200).json({
      success: true,
      reply,
      sessionId: sessionId || "default",
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI service is temporarily unavailable. Please try again.",
    });
  }
};

const clearSession = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    const { sessionId } = req.params;
    const sessionKey = `${userId}_${sessionId || "default"}`;
    chatSessions.delete(sessionKey);
    return res.status(200).json({ success: true, message: "Session cleared" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error clearing session" });
  }
};

module.exports = { chat, clearSession };