const express    = require("express");
const router     = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const ctrl       = require("./registration.controller");

// Order matters — specific routes before param routes
router.get("/mine",           protect, ctrl.getMyRegistrations);
router.get("/check/:eventId", protect, ctrl.checkRegistration);
router.post("/:eventId",      protect, ctrl.registerForEvent);
router.delete("/:eventId",    protect, ctrl.cancelRegistration);

module.exports = router;