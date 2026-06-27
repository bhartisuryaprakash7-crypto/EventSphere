const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
  event:   { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  ratings: {
    overall:      { type: Number, min: 1, max: 5, required: true },
    organisation: { type: Number, min: 1, max: 5 },
    content:      { type: Number, min: 1, max: 5 },
    venue:        { type: Number, min: 1, max: 5 },
    food:         { type: Number, min: 1, max: 5 },
  },
  comment:   { type: String, maxlength: 1000 },
  anonymous: { type: Boolean, default: false },
}, { timestamps: true });

// One feedback per student per event
FeedbackSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", FeedbackSchema);