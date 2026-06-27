const Certificate = require("./certificate.model");
const PDFDocument = require("pdfkit");

// GET /api/certificates/mine
exports.getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user._id })
      .populate({
        path: "event",
        select: "title date venue category organizer",
        populate: { path: "organizer", select: "name" },
      })
      .sort({ issuedAt: -1 });

    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/certificates/:certId/download  — streams a PDF
exports.downloadCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.certId)
      .populate("student", "name email")
      .populate("event",   "title date organizer");

    if (!cert) return res.status(404).json({ message: "Certificate not found." });

    // Only the owner can download
    if (cert.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const doc      = new PDFDocument({ size: "A4", layout: "landscape", margin: 60 });
    const filename = `Certificate-${cert.event.title.replace(/\s+/g, "-")}.pdf`;

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    // ── PDF Design ────────────────────────────────────────────────────────
    const W = doc.page.width;
    const H = doc.page.height;

    // Background
    doc.rect(0, 0, W, H).fill("#0F172A");

    // Border
    doc.rect(25, 25, W - 50, H - 50)
       .lineWidth(1.5)
       .stroke("#6366F1");

    // Inner border (decorative)
    doc.rect(35, 35, W - 70, H - 70)
       .lineWidth(0.5)
       .stroke("#4338CA");

    // Top label
    doc.fillColor("#6366F1")
       .fontSize(9)
       .font("Helvetica")
       .text("EVENTSPHERE • CERTIFICATE OF PARTICIPATION", { align: "center" })
       .moveDown(1.5);

    // Decorative line
    doc.moveTo(80, doc.y).lineTo(W - 80, doc.y).stroke("#4338CA");
    doc.moveDown(1.2);

    // "This is to certify that"
    doc.fillColor("#94A3B8")
       .fontSize(11)
       .text("This is to certify that", { align: "center" })
       .moveDown(0.4);

    // Student name
    doc.fillColor("#FFFFFF")
       .fontSize(30)
       .font("Helvetica-Bold")
       .text(cert.student.name, { align: "center" })
       .moveDown(0.4);

    // Sub-text
    doc.fillColor("#94A3B8")
       .fontSize(11)
       .font("Helvetica")
       .text("has successfully participated in", { align: "center" })
       .moveDown(0.4);

    // Event title
    doc.fillColor("#818CF8")
       .fontSize(22)
       .font("Helvetica-Bold")
       .text(cert.event.title, { align: "center" })
       .moveDown(0.5);

    // Date
    doc.fillColor("#64748B")
       .fontSize(10)
       .font("Helvetica")
       .text(
         `Held on ${new Date(cert.event.date).toLocaleDateString("en-IN", { dateStyle: "long" })}`,
         { align: "center" }
       )
       .moveDown(1.5);

    // Bottom line
    doc.moveTo(80, doc.y).lineTo(W - 80, doc.y).stroke("#4338CA");
    doc.moveDown(0.8);

    // Credential ID
    doc.fillColor("#475569")
       .fontSize(8)
       .text(`Credential ID: ${cert.credentialId}`, { align: "center" });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Helper — called internally when attendance is marked "Attended"
exports.generateCertificateIfNeeded = async (registrationId, studentId, eventId) => {
  try {
    const existing = await Certificate.findOne({ registration: registrationId });
    if (!existing) {
      await Certificate.create({
        student:      studentId,
        event:        eventId,
        registration: registrationId,
      });
      console.log(`✅ Certificate auto-generated for registration: ${registrationId}`);
    }
  } catch (err) {
    console.error("Certificate generation error:", err.message);
  }
};