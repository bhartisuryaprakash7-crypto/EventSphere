const Attendance = require("./attendance.model");
const mongoose = require("mongoose");

exports.markAttendance = async (req, res) => {
  try {
    const { eventId, rollNumber, studentName } = req.body;

    if (!eventId || !rollNumber || !studentName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if eventId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID format" });
    }

    const existing = await Attendance.findOne({ event: eventId, rollNumber });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked!" });
    }

    const record = await Attendance.create({
      event: eventId,
      rollNumber,
      studentName,
      status: "Present"
    });

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if eventId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID format" });
    }

    const records = await Attendance.find({ event: eventId });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};