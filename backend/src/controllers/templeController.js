const Temple = require('../models/Temple');
const User = require('../models/User');
const Slot = require('../models/Slot');

// @desc    Register a new temple (by Organizer or Admin)
// @route   POST /api/temples
// @access  Private/Organizer/Admin
exports.createTemple = async (req, res) => {
    const { name, description, location, darshanHours, imageUrl, mapLink, organizerId } = req.body;

    try {
        // Admin can assign any organizer; organizers are auto-assigned to themselves
        let assignedOrganizer = req.user._id;
        if (req.user.role === 'admin' && organizerId) {
            assignedOrganizer = organizerId;
        }

        const temple = await Temple.create({
            name,
            description,
            location,
            darshanHours,
            imageUrl: imageUrl || '',
            mapLink: mapLink || '',
            organizer: assignedOrganizer,
            // Admin-created temples are auto-approved
            approved: req.user.role === 'admin' ? true : false
        });

        // Auto-generate generic daily slots for the next 7 days
        try {
            const slotsData = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                slotsData.push({
                    templeId: temple._id,
                    date: date,
                    timeRange: { start: darshanHours.start, end: darshanHours.end },
                    pricePerPerson: 50, // Default price
                    maxSeats: 100,      // Default seats
                    active: true
                });
            }
            await Slot.insertMany(slotsData);
        } catch (slotErr) {
            console.error("Error auto-generating slots:", slotErr);
            // Non-fatal, keep going
        }

        res.status(201).json(temple);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get temples based on role
// @route   GET /api/temples
// @access  Public/Private
exports.getTemples = async (req, res) => {
    try {
        let filter = { approved: true };

        if (req.user) {
            if (req.user.role === 'admin') {
                filter = {};
            } else if (req.user.role === 'organizer') {
                filter = {
                    $or: [
                        { approved: true },
                        { organizer: req.user._id }
                    ]
                };
            }
        }

        const temples = await Temple.find(filter).populate('organizer', 'name email');
        res.json(temples);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get list of organizers (for Admin dropdown)
// @route   GET /api/temples/organizers
// @access  Private/Admin
exports.getOrganizers = async (req, res) => {
    try {
        const organizers = await User.find({ role: 'organizer' }).select('name email _id');
        res.json(organizers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a temple
// @route   PUT /api/temples/:id
// @access  Private/Admin
exports.updateTemple = async (req, res) => {
    try {
        const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!temple) return res.status(404).json({ message: 'Temple not found' });
        res.json(temple);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a temple
// @route   DELETE /api/temples/:id
// @access  Private/Admin
exports.deleteTemple = async (req, res) => {
    try {
        const temple = await Temple.findByIdAndDelete(req.params.id);
        if (!temple) return res.status(404).json({ message: 'Temple not found' });
        res.json({ message: 'Temple deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a temple (by Admin)
// @route   PUT /api/temples/:id/approve
// @access  Private/Admin
exports.approveTemple = async (req, res) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (temple) {
            temple.approved = true;
            const updatedTemple = await temple.save();
            res.json(updatedTemple);
        } else {
            res.status(404).json({ message: 'Temple not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
