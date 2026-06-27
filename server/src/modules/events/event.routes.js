const express = require("express");
const router  = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  getPendingEvents,
  approveEvent,
  rejectEvent,
  deleteEvent,
} = require("./event.controller");

const { protect }        = require("../../middleware/authMiddleware");
const { authorizeRoles } = require("../../middleware/roleMiddleware");

// ── Public / Student ──
router.get("/approved", getEvents);
router.get("/",         getEvents);

// ── Organizer ──
router.post("/",     protect, authorizeRoles("organizer", "admin"), createEvent);
router.get("/mine",  protect, authorizeRoles("organizer", "admin"), getMyEvents);  // ← NEW

// ── Faculty / Admin ──
router.get("/pending",       protect, authorizeRoles("faculty", "admin"), getPendingEvents);
router.put("/:id/approve",   protect, authorizeRoles("faculty", "admin"), approveEvent);
router.put("/:id/reject",    protect, authorizeRoles("faculty", "admin"), rejectEvent);

// ── Single event + delete ──
router.get("/:id",    protect, getEventById);   // ← NEW (attendance page ke liye)
router.delete("/:id", protect, authorizeRoles("organizer", "admin"), deleteEvent);  // ← NEW

module.exports = router;