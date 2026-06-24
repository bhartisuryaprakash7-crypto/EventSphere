const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Present"
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
});

// Ek hi event me ek student do baar scan na ho sake
attendanceSchema.index({ event: 1, rollNumber: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);