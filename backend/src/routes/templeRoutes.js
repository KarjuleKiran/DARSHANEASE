const express = require('express');
const router = express.Router();
const {
    createTemple,
    getTemples,
    approveTemple,
    getOrganizers,
    updateTemple,
    deleteTemple
} = require('../controllers/templeController');
const { protect, authorize, optionalProtect } = require('../middleware/auth');

router.post('/', protect, authorize('organizer', 'admin'), createTemple);
router.get('/', optionalProtect, getTemples);
router.get('/organizers', protect, authorize('admin'), getOrganizers);
router.put('/:id/approve', protect, authorize('admin'), approveTemple);
router.put('/:id', protect, authorize('admin'), updateTemple);
router.delete('/:id', protect, authorize('admin'), deleteTemple);

module.exports = router;
