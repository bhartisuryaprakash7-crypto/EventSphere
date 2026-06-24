const express = require('express');
const { getGeminiModel } = require('../../config/gemini');
const { protect }        = require('../../middleware/authMiddleware');
const Event              = require('../events/event.model');
const Feedback           = require('../feedback/feedback.model');

// ── AI Chat ───────────────────────────────────────────────────
const aiChat = async (req, res) => {
  try {
    const { message } = req.body;
    const model  = getGeminiModel();
    const result = await model.generateContent(message);
    const text   = result.response.text();
    res.json({ reply: text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Event Recommendations ─────────────────────────────────────
const getRecommendations = async (req, res) => {
  try {
    const { interests } = req.body; // e.g. ['sports', 'tech', 'music']

    const events = await Event.find({ status: 'approved' })
      .select('title description tags startDate')
      .limit(20)
      .lean();

    const prompt = `
You are an event recommendation engine.
User interests: ${interests.join(', ')}.
Available events:
${events.map((e, i) => `${i + 1}. ${e.title} - Tags: ${e.tags?.join(', ')} - Desc: ${e.description?.slice(0, 100)}`).join('\n')}

Return top 5 event numbers (just the numbers, comma separated) best matching the user's interests.
    `.trim();

    const model  = getGeminiModel();
    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    // Parse indices from response
    const indices = text.match(/\d+/g)?.map(Number) || [];
    const recommended = indices.slice(0, 5).map((i) => events[i - 1]).filter(Boolean);

    res.json({ recommendations: recommended });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Feedback Summary using Gemini ─────────────────────────────
const getFeedbackSummary = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId }).lean();
    if (!feedbacks.length) return res.json({ summary: 'No feedback available yet.' });

    const comments = feedbacks.map((f) => `Rating: ${f.rating}/5 - ${f.comment}`).join('\n');

    const prompt = `
Summarize the following event feedback in 3-4 sentences. Highlight positives and areas of improvement.
Feedback:
${comments}
    `.trim();

    const model  = getGeminiModel();
    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Routes ────────────────────────────────────────────────────
const router = express.Router();

router.post('/chat',                    protect, aiChat);
router.post('/recommendations',         protect, getRecommendations);
router.get('/feedback-summary/:eventId', protect, getFeedbackSummary);

module.exports = router;