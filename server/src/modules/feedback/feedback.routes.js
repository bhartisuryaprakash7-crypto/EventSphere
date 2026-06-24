const express = require('express');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { submitFeedback, getEventFeedback } = require('./feedback.controller');

const router = express.Router();

router.post('/event/:eventId',  protect, authorizeRoles('student'),                      submitFeedback);
router.get('/event/:eventId',   protect, authorizeRoles('organizer', 'admin', 'faculty'), getEventFeedback);

module.exports = router;