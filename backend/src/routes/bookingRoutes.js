const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('user', 'admin', 'organizer'), createBooking);
router.get('/my-bookings', protect, authorize('user'), getMyBookings);
router.get('/', protect, authorize('admin', 'organizer'), getAllBookings);

module.exports = router;
