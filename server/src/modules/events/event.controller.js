const Event = require("./event.model");

// ── Get Approved Events (Student Browse) ──
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Pending Events (Faculty Approval) ──
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Create Event — organizer ID save hoga ab ──
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user._id,   // ← yeh line add ki — pehle missing thi
      status: "pending",
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get My Events (Organizer) — NEW ──
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Single Event by ID ──
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event nahi mila" });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Approve Event ──
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Reject Event ──
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectionReason: req.body.reason ?? "" },
      { new: true }
    );
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Delete Event ──
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Event delete ho gaya" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};