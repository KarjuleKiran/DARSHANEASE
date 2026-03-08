const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    templeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: true
    },
    date: { type: Date, required: true },
    timeRange: {
        start: { type: String, required: true }, // e.g., "06:00 AM"
        end: { type: String, required: true }    // e.g., "08:00 AM"
    },
    pricePerPerson: { type: Number, required: true, default: 0 },
    maxSeats: { type: Number, required: true },
    bookedSeats: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Slot', SlotSchema);
