const Feedback = require('./feedback.model');

const submitFeedback = async (req, res) => {
  try {
    const fb = await Feedback.create({
      event:   req.params.eventId,
      student: req.user._id,
      rating:  req.body.rating,
      comment: req.body.comment,
    });
    res.status(201).json({ message: 'Feedback submitted', feedback: fb });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Already submitted feedback' });
    res.status(500).json({ message: error.message });
  }
};

const getEventFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ event: req.params.eventId })
      .populate('student', 'name');

    const avg = feedbacks.reduce((sum, f) => sum + f.rating, 0) / (feedbacks.length || 1);
    res.json({ feedbacks, averageRating: avg.toFixed(1), total: feedbacks.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitFeedback, getEventFeedback };