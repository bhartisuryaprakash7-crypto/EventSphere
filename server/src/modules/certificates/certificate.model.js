const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  student:      { type: mongoose.Schema.Types.ObjectId, ref: "User",         required: true },
  event:        { type: mongoose.Schema.Types.ObjectId, ref: "Event",        required: true },
  registration: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", required: true },
  credentialId: { type: String, unique: true },
  issuedAt:     { type: Date, default: Date.now },
}, { timestamps: true });

CertificateSchema.pre("save", function (next) {
  if (!this.credentialId) {
    this.credentialId =
      "CRD-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Certificate", CertificateSchema);