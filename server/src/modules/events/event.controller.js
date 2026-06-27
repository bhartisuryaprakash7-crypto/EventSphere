const Event = require("./event.model");

// Get Approved Events (Student Browse Events)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: "approved",
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Pending Events (Faculty Approval Page)
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: "pending",
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// created event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      status: "pending",
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Approve Event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
      },
      {
        new: true,
      }
    );

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Reject Event
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
      },
      {
        new: true,
      }
    );

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};