const express    = require("express");
const router     = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const ctrl       = require("./feedback.controller");

router.get("/check/:eventId",  protect, ctrl.checkFeedback);
router.get("/event/:eventId",  protect, ctrl.getEventFeedback);
router.post("/",               protect, ctrl.submitFeedback);

module.exports = router;