const mongoose = require('mongoose');
const { EVENT_STATUS } = require('../../constants');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    banner: { type: String, default: '' },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },

    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },

    maxParticipants: { type: Number, default: 100 },
    registrationDeadline: { type: Date },

    tags: [String],

    status: {
      type: String,
      enum: Object.values(EVENT_STATUS),
      default: EVENT_STATUS.PENDING,
    },

    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual: registered count (populated separately)
eventSchema.virtual('registeredCount', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'event',
  count: true,
});

module.exports = mongoose.model('Event', eventSchema);