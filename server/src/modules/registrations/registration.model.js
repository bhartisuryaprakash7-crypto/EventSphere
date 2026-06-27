const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
  event:     { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  ticketId:  { type: String, unique: true },
  status:    { type: String, enum: ["Upcoming", "Attended", "Absent"], default: "Upcoming" },
  registeredAt: { type: Date, default: Date.now },
}, { timestamps: true });

RegistrationSchema.pre("save", function (next) {
  if (!this.ticketId) {
    this.ticketId = "REG-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Registration", RegistrationSchema);