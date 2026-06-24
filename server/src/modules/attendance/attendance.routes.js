const express = require("express");
const router = express.Router();
// Dhyaan dein: controller agar isi attendance folder me hai toh path "./attendance.controller" hoga
const { markAttendance, getEventAttendance } = require("./attendance.controller");

// Endpoints
router.post("/mark", markAttendance);
router.get("/event/:eventId", getEventAttendance);

module.exports = router;