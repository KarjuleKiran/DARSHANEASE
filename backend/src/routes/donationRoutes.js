const express = require('express');
const router = express.Router();
const { createDonation, getAllDonations, getTempleDonations } = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('user', 'admin', 'organizer'), createDonation);
router.get('/', protect, authorize('admin', 'organizer'), getAllDonations);
router.get('/temple/:templeId', protect, authorize('organizer'), getTempleDonations);

module.exports = router;
