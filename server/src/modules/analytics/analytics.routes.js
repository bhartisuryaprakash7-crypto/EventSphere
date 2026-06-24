const Event        = require('../events/event.model');
const Registration = require('../registrations/registration.model');
const Attendance   = require('../attendance/attendance.model');
const Feedback     = require('../feedback/feedback.model');

const getEventAnalytics = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const [regCount, attCount, feedback] = await Promise.all([
      Registration.countDocuments({ event: eventId }),
      Attendance.countDocuments({ event: eventId }),
      Feedback.find({ event: eventId }),
    ]);

    const avgRating = feedback.length
      ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
      : 0;

    res.json({ registrations: regCount, attendance: attCount, feedbackCount: feedback.length, avgRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [totalEvents, totalRegs, totalAttendance] = await Promise.all([
      Event.countDocuments(),
      Registration.countDocuments(),
      Attendance.countDocuments(),
    ]);

    const eventsByStatus = await Event.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({ totalEvents, totalRegs, totalAttendance, eventsByStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Routes inline for brevity
const express = require('express');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');

const router = express.Router();
router.get('/dashboard',        protect, authorizeRoles('admin', 'faculty'), getDashboardStats);
router.get('/event/:eventId',   protect, authorizeRoles('organizer', 'admin', 'faculty'), getEventAnalytics);

module.exports = router;