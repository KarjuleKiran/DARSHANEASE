const Donation = require('../models/Donation');

// @desc    Give a donation to a temple
// @route   POST /api/donations
// @access  Private/User
exports.createDonation = async (req, res) => {
    const { templeId, amount, message } = req.body;

    try {
        const donation = await Donation.create({
            user: req.user._id,
            temple: templeId,
            amount,
            message
        });

        res.status(201).json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all donations (Admin/Organizer)
// @route   GET /api/donations
// @access  Private
exports.getAllDonations = async (req, res) => {
    try {
        let filter = {};

        // If organizer, only show donations for temples they own
        if (req.user.role === 'organizer') {
            const Temple = require('../models/Temple');
            const temples = await Temple.find({ organizer: req.user._id });
            const templeIds = temples.map(t => t._id);
            filter = { temple: { $in: templeIds } };
        }

        const donations = await Donation.find(filter)
            .populate('user', 'name email')
            .populate('temple', 'name');
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get donations for a specific temple (Organizer only)
// @route   GET /api/donations/temple/:templeId
// @access  Private/Organizer
exports.getTempleDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ temple: req.params.templeId })
            .populate('user', 'name email');
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
