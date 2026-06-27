// ─── analytics.routes.js (UPDATED) ───────────────────────────
// Existing file mein bas getOrganizerAnalytics function aur route add karo
// Baaki sab same rehne do

const Event        = require('../events/event.model');
const Registration = require('../registrations/registration.model');
const Attendance   = require('../attendance/attendance.model');
const Feedback     = require('../feedback/feedback.model');

// ── Existing: Event-level analytics ──
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

// ── Existing: Dashboard stats (admin/faculty only) ──
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

// ── NEW: Organizer ke apne events ki analytics ──
const getOrganizerAnalytics = async (req, res) => {
  try {
    const organizerId = req.user._id;

    // Organizer ke saare events
    const myEvents = await Event.find({ organizer: organizerId }).lean();

    if (myEvents.length === 0) {
      return res.json({
        success: true,
        data: {
          totalEvents: 0,
          totalRegistrations: 0,
          totalAttendance: 0,
          pendingApprovals: 0,
          eventWise: [],
          categoryBreakdown: [],
        },
      });
    }

    const eventIds = myEvents.map((e) => e._id);

    // Sab ek saath fetch karo
    const [regAgg, attAgg] = await Promise.all([
      Registration.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: '$event', count: { $sum: 1 } } },
      ]),
      Attendance.aggregate([
        { $match: { event: { $in: eventIds } } },
        { $group: { _id: '$event', count: { $sum: 1 } } },
      ]),
    ]);

    // Maps for quick lookup
    const regMap = Object.fromEntries(regAgg.map((r) => [r._id.toString(), r.count]));
    const attMap = Object.fromEntries(attAgg.map((a) => [a._id.toString(), a.count]));

    // Event-wise breakdown
    const eventWise = myEvents.map((ev) => ({
      _id:           ev._id,
      title:         ev.title,
      category:      ev.category,
      status:        ev.status,
      date:          ev.date,
      registrations: regMap[ev._id.toString()] ?? 0,
      attendance:    attMap[ev._id.toString()] ?? 0,
    }));

    // Totals
    const totalRegistrations = eventWise.reduce((s, e) => s + e.registrations, 0);
    const totalAttendance    = eventWise.reduce((s, e) => s + e.attendance, 0);
    const pendingApprovals   = myEvents.filter((e) => e.status === 'pending').length;

    // Category breakdown
    const catMap = {};
    myEvents.forEach((ev) => {
      catMap[ev.category] = (catMap[ev.category] ?? 0) + 1;
    });
    const categoryBreakdown = Object.entries(catMap).map(([category, count]) => ({
      _id: category,
      count,
    }));

    res.json({
      success: true,
      data: {
        totalEvents:        myEvents.length,
        totalRegistrations,
        totalAttendance,
        pendingApprovals,
        eventWise,
        categoryBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Routes ──
const express = require('express');
const { protect }         = require('../../middleware/authMiddleware');
const { authorizeRoles }  = require('../../middleware/roleMiddleware');

const router = express.Router();

router.get('/dashboard',        protect, authorizeRoles('admin', 'faculty'), getDashboardStats);
router.get('/event/:eventId',   protect, authorizeRoles('organizer', 'admin', 'faculty'), getEventAnalytics);

// ← NEW route organizer ke liye
router.get('/organizer',        protect, authorizeRoles('organizer', 'admin'), getOrganizerAnalytics);

module.exports = router;