const express = require('express');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations } = require('./registration.controller');

const router = express.Router();

router.post('/event/:eventId',        protect, authorizeRoles('student'), registerForEvent);
router.get('/my',                     protect, authorizeRoles('student'), getMyRegistrations);
router.patch('/:id/cancel',           protect, authorizeRoles('student'), cancelRegistration);
router.get('/event/:eventId/all',     protect, authorizeRoles('organizer', 'admin', 'faculty'), getEventRegistrations);

module.exports = router;