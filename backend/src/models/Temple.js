const mongoose = require('mongoose');

const TempleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String },
    darshanHours: {
        start: { type: String, required: true }, // e.g., "04:00 AM"
        end: { type: String, required: true }    // e.g., "09:00 PM"
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approved: { type: Boolean, default: false },
    mapLink: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Temple', TempleSchema);
