const express = require('express');
const router = express.Router();
const { addSlot, getSlotsByTemple } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('organizer'), addSlot);
router.get('/temple/:templeId', getSlotsByTemple);

module.exports = router;
