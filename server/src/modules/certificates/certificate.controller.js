const crypto      = require('crypto');
const Certificate = require('./certificate.model');
const Attendance  = require('../attendance/attendance.model');

// Issue certificate (organizer/admin after event)
const issueCertificate = async (req, res) => {
  try {
    const { eventId, studentId, fileUrl } = req.body;

    // Check attendance
    const attended = await Attendance.findOne({ event: eventId, student: studentId });
    if (!attended) return res.status(400).json({ message: 'Student did not attend the event' });

    const uniqueCode = crypto.randomBytes(8).toString('hex').toUpperCase();

    const cert = await Certificate.create({ event: eventId, student: studentId, fileUrl, uniqueCode });
    res.status(201).json({ message: 'Certificate issued', certificate: cert });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Certificate already issued' });
    res.status(500).json({ message: error.message });
  }
};

// Get my certificates
const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user._id })
      .populate('event', 'title startDate');
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify certificate by unique code (public)
const verifyCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ uniqueCode: req.params.code })
      .populate('student', 'name email')
      .populate('event', 'title startDate');
    if (!cert) return res.status(404).json({ message: 'Certificate not found or invalid' });
    res.json({ valid: true, certificate: cert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { issueCertificate, getMyCertificates, verifyCertificate };