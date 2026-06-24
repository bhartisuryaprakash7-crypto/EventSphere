const Event = require('./event.model');
const { EVENT_STATUS, ROLES } = require('../../constants');

// ── @GET /api/events ─ Browse all approved events ─────────────
const getAllEvents = async (req, res) => {
  try {
    const { search, tag, department, page = 1, limit = 10 } = req.query;
    const filter = { status: EVENT_STATUS.APPROVED, isPublic: true };

    if (search)     filter.title      = { $regex: search, $options: 'i' };
    if (tag)        filter.tags       = tag;
    if (department) filter.department = department;

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .populate('venue', 'name location')
      .sort({ startDate: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Event.countDocuments(filter);
    res.json({ events, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @GET /api/events/:id ──────────────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('venue', 'name location capacity')
      .populate('department', 'name')
      .populate('approvedBy', 'name');

    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @POST /api/events ─ Create event (organizer) ──────────────
const createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, organizer: req.user._id };
    if (req.file) eventData.banner = req.file.path;

    const event = await Event.create(eventData);
    res.status(201).json({ message: 'Event created, pending approval', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @PUT /api/events/:id ──────────────────────────────────────
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only organizer who created it (or admin) can update
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.file) req.body.banner = req.file.path;
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @DELETE /api/events/:id ───────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @PATCH /api/events/:id/approve ─ Faculty approves ─────────
const approveEvent = async (req, res) => {
  try {
    const { status, reason } = req.body; // status: approved | rejected
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status, approvedBy: req.user._id, rejectionReason: reason },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: `Event ${status}`, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── @GET /api/events/my-events ─ Organizer's events ──────────
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, approveEvent, getMyEvents };