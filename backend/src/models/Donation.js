const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: true
    },
    amount: { type: Number, required: true },
    message: { type: String },
    donationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
