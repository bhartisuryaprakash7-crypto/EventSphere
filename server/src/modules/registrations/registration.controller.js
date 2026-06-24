const Registration = require('./registration.model');
const Event        = require('../events/event.model');

// Register for an event
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    const count = await Registration.countDocuments({ event: event._id });
    if (count >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const reg = await Registration.create({ event: event._id, student: req.user._id });
    res.status(201).json({ message: 'Registered successfully', registration: reg });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Already registered' });
    res.status(500).json({ message: error.message });
  }
};

// Get my registrations
const getMyRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ student: req.user._id })
      .populate('event', 'title startDate endDate venue status banner');
    res.json(regs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel registration
const cancelRegistration = async (req, res) => {
  try {
    const reg = await Registration.findOne({ _id: req.params.id, student: req.user._id });
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    reg.status = 'cancelled';
    await reg.save();
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all registrations for an event (organizer/admin)
const getEventRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ event: req.params.eventId })
      .populate('student', 'name email department');
    res.json(regs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations };