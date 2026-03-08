const Slot = require('../models/Slot');
const Temple = require('../models/Temple');

// @desc    Add a slot to a temple (by Organizer)
// @route   POST /api/slots
// @access  Private/Organizer
exports.addSlot = async (req, res) => {
    const { templeId, date, timeRange, pricePerPerson, maxSeats } = req.body;

    try {
        const temple = await Temple.findById(templeId);

        if (!temple) {
            return res.status(404).json({ message: 'Temple not found' });
        }

        if (temple.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to manage this temple' });
        }

        const slot = await Slot.create({
            templeId,
            date,
            timeRange,
            pricePerPerson,
            maxSeats
        });

        res.status(201).json(slot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get slots for a temple
// @route   GET /api/slots/temple/:templeId
// @access  Public
exports.getSlotsByTemple = async (req, res) => {
    try {
        const slots = await Slot.find({ templeId: req.params.templeId, active: true })
            .populate('templeId', 'name location darshanHours');
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
