const Feedback     = require("./feedback.model");
const Registration = require("../registrations/registration.model");

// GET /api/feedback/check/:eventId
exports.checkFeedback = async (req, res) => {
  try {
    const exists = await Feedback.findOne({
      student: req.user._id,
      event:   req.params.eventId,
    });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/feedback
exports.submitFeedback = async (req, res) => {
  const { eventId, ratings, comment, anonymous } = req.body;

  if (!eventId || !ratings?.overall) {
    return res.status(400).json({ message: "eventId and overall rating are required." });
  }

  try {
    // Verify student actually attended the event
    const reg = await Registration.findOne({
      student: req.user._id,
      event:   eventId,
      status:  "Attended",
    });

    if (!reg) {
      return res.status(403).json({
        message: "You can only submit feedback for events you attended.",
      });
    }

    const feedback = await Feedback.create({
      student:   req.user._id,
      event:     eventId,
      ratings,
      comment:   comment?.trim(),
      anonymous: anonymous || false,
    });

    res.status(201).json({ message: "Feedback submitted successfully.", feedback });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already submitted feedback for this event." });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/feedback/event/:eventId  (organizer/admin use)
exports.getEventFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate({
        path:   "student",
        select: "name",
      })
      .sort({ createdAt: -1 });

    // Hide student name if anonymous
    const data = feedbacks.map((f) => ({
      ...f.toObject(),
      student: f.anonymous ? { name: "Anonymous" } : f.student,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};