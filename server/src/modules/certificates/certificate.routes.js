const express    = require("express");
const router     = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const ctrl       = require("./certificate.controller");

router.get("/mine",             protect, ctrl.getMyCertificates);
router.get("/:certId/download", protect, ctrl.downloadCertificate);

module.exports = router;