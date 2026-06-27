const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getEventAttendance,
  generateQRCode,
} = require("./attendance.controller");

router.get("/qrcode/:eventId", generateQRCode);

router.post("/mark", markAttendance);

router.get("/event/:eventId", getEventAttendance);

module.exports = router;