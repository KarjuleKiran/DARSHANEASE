const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Temple = require('../models/Temple');

// @desc    Book a Darshan slot
// @route   POST /api/bookings
// @access  Private/User
exports.createBooking = async (req, res) => {
    const { slotId, devotees } = req.body;

    try {
        const slot = await Slot.findById(slotId);

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (!slot.active) {
            return res.status(400).json({ message: 'Slot is no longer active' });
        }

        if (slot.bookedSeats + devotees > slot.maxSeats) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        const totalAmount = slot.pricePerPerson * devotees;

        const booking = await Booking.create({
            user: req.user._id,
            temple: slot.templeId._id || slot.templeId,
            slot: slotId,
            devotees,
            totalAmount
        });

        // Update booked seats in slot
        slot.bookedSeats += devotees;
        await slot.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's personal bookings
// @route   GET /api/bookings/my-bookings
// @access  Private/User
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('temple', 'name location')
            .populate('slot', 'date timeRange');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin/Organizer)
// @route   GET /api/bookings
// @access  Private
exports.getAllBookings = async (req, res) => {
    try {
        let filter = {};

        // If organizer, only show bookings for temples they own
        if (req.user.role === 'organizer') {
            const temples = await Temple.find({ organizer: req.user._id });
            const templeIds = temples.map(t => t._id);
            filter = { temple: { $in: templeIds } };
        }
        // If admin, filter remains {} (all)

        const bookings = await Booking.find(filter)
            .populate('user', 'name email')
            .populate('temple', 'name')
            .populate('slot', 'date timeRange');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
