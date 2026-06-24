const mongoose = require('mongoose');
const express  = require('express');
const { protect } = require('../../middleware/authMiddleware');

// ── Schema ────────────────────────────────────────────────────
const notificationSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    isRead:  { type: Boolean, default: false },
    link:    { type: String },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

// ── Controller ────────────────────────────────────────────────
const getMyNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to create notification from other modules
const createNotification = async ({ userId, title, message, link }) => {
  await Notification.create({ user: userId, title, message, link });
};

// ── Routes ────────────────────────────────────────────────────
const router = express.Router();
router.get('/',         protect, getMyNotifications);
router.patch('/read',   protect, markAllRead);

module.exports = router;
module.exports.createNotification = createNotification;