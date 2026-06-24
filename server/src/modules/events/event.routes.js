const express  = require('express');
const { protect }         = require('../../middleware/authMiddleware');
const { authorizeRoles }  = require('../../middleware/roleMiddleware');
const { uploadImage }     = require('../../middleware/uploadMiddleware');
const {
  getAllEvents, getEventById, createEvent,
  updateEvent, deleteEvent, approveEvent, getMyEvents,
} = require('./event.controller');

const router = express.Router();

router.get('/',              getAllEvents);
router.get('/my-events',     protect, authorizeRoles('organizer'),        getMyEvents);
router.get('/:id',           getEventById);
router.post('/',             protect, authorizeRoles('organizer', 'admin'), uploadImage.single('banner'), createEvent);
router.put('/:id',           protect, authorizeRoles('organizer', 'admin'), uploadImage.single('banner'), updateEvent);
router.delete('/:id',        protect, authorizeRoles('organizer', 'admin'), deleteEvent);
router.patch('/:id/approve', protect, authorizeRoles('faculty', 'admin'),  approveEvent);

module.exports = router;