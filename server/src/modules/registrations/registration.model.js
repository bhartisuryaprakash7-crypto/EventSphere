const mongoose = require('mongoose');
const { REGISTRATION_STATUS } = require('../../constants');

const registrationSchema = new mongoose.Schema(
{
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  qrToken: {
    type: String,
    unique: true,
    sparse: true
  },

  qrGeneratedAt: {
    type: Date
  },

  status: {
    type: String,
    enum: Object.values(REGISTRATION_STATUS),
    default: REGISTRATION_STATUS.REGISTERED
  },

  registeredAt: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true }
);

registrationSchema.index(
  { event: 1, student: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  'Registration',
  registrationSchema
);