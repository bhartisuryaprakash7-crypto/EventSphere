const express = require('express');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');
const { issueCertificate, getMyCertificates, verifyCertificate } = require('./certificate.controller');

const router = express.Router();

router.post('/',            protect, authorizeRoles('organizer', 'admin'), issueCertificate);
router.get('/my',           protect, authorizeRoles('student'),            getMyCertificates);
router.get('/verify/:code',                                                 verifyCertificate);

module.exports = router;