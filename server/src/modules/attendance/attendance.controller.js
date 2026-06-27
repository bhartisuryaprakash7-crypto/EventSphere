const Attendance = require("./attendance.model");
const Registration = require("../registrations/registration.model");
const { generateCertificateIfNeeded } = require("../certificates/certificate.controller");
const mongoose = require("mongoose");

exports.markAttendance = async (req, res) => {
  try {

    const {
      eventId,
      studentId,
      registrationId,
      rollNumber,
      studentName,
    } = req.body;

    if (!eventId || !rollNumber || !studentName) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event ID",
      });
    }

    const alreadyMarked = await Attendance.findOne({
      event: eventId,
      rollNumber,
    });

    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked",
      });
    }

    const attendance = await Attendance.create({
      event: eventId,
      student: studentId || null,
      rollNumber,
      studentName,
      status: "Present",
    });

    if (registrationId) {
      await Registration.findByIdAndUpdate(
        registrationId,
        {
          status: "Attended",
        }
      );

      if (studentId) {
        await generateCertificateIfNeeded(
          registrationId,
          studentId,
          eventId
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.getEventAttendance = async (req, res) => {

  try {

    const records = await Attendance.find({
      event: req.params.eventId,
    }).sort({
      scannedAt: -1,
    });

    return res.json({
      success: true,
      data: records,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};
const QRCode = require("qrcode");

exports.generateQRCode = async (req, res) => {
  try {
    const { eventId } = req.params;

    const qrData = JSON.stringify({
      eventId,
      timestamp: Date.now(),
    });

    const qrCode = await QRCode.toDataURL(qrData);

    return res.json({
      success: true,
      qrCode,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};