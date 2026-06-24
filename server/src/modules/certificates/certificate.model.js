const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    event:       { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
    fileUrl:     { type: String, required: true },
    issuedAt:    { type: Date, default: Date.now },
    uniqueCode:  { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);