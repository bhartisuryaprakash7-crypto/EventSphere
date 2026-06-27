const Registration = require("./registration.model");
const Certificate  = require("../certificates/certificate.model");
const Event        = require("../events/event.model");

// GET /api/registrations/mine
exports.getMyRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ student: req.user._id })
      .populate({
        path: "event",
        select: "title date time venue category tags capacity organizer",
        populate: { path: "organizer", select: "name" },
      })
      .sort({ registeredAt: -1 });

    // Attach certificateId if certificate exists for each registration
    const regIds  = regs.map((r) => r._id);
    const certs   = await Certificate.find({ registration: { $in: regIds } }).select("registration _id");
    const certMap = {};
    certs.forEach((c) => { certMap[c.registration.toString()] = c._id; });

    const data = regs.map((r) => ({
      ...r.toObject(),
      certificateId: certMap[r._id.toString()] || null,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/registrations/check/:eventId
exports.checkRegistration = async (req, res) => {
  try {
    const reg = await Registration.findOne({
      student: req.user._id,
      event:   req.params.eventId,
    });
    res.json({ isRegistered: !!reg, registration: reg });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/registrations/:eventId
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event)                      return res.status(404).json({ message: "Event not found." });
    if (event.status !== "approved") return res.status(400).json({ message: "Event is not open for registration." });

    // Capacity check
    const count = await Registration.countDocuments({ event: event._id });
    if (event.capacity && count >= event.capacity) {
      return res.status(400).json({ message: "Event is full." });
    }

    // Duplicate check
    const existing = await Registration.findOne({ student: req.user._id, event: event._id });
    if (existing) return res.status(409).json({ message: "You are already registered for this event." });

    const reg = await Registration.create({ student: req.user._id, event: event._id });
    await reg.populate({ path: "event", select: "title date venue category" });

    res.status(201).json({ message: "Registered successfully!", registration: reg });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/registrations/:eventId
exports.cancelRegistration = async (req, res) => {
  try {
    const reg = await Registration.findOne({
      student: req.user._id,
      event:   req.params.eventId,
    });
    if (!reg)                      return res.status(404).json({ message: "Registration not found." });
    if (reg.status !== "Upcoming") return res.status(400).json({ message: "Cannot cancel a past registration." });

    await reg.deleteOne();
    res.json({ message: "Registration cancelled." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};