const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/darshanease';

// ── Inline schemas (avoids circular import issues) ──────────────────────────
const UserSchema = new mongoose.Schema({
    name: String, email: String, password: String, role: String
});
const TempleSchema = new mongoose.Schema({
    name: String, description: String, location: String,
    imageUrl: String, darshanHours: { start: String, end: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approved: Boolean, mapLink: String, createdAt: Date
});

const User = mongoose.model('User', UserSchema);
const Temple = mongoose.model('Temple', TempleSchema);

async function assignOrganizers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Fetch all organizers sorted by email (organizer1, 2, 3 ...)
        const organizers = await User.find({ role: 'organizer' }).sort({ email: 1 });
        if (organizers.length === 0) {
            console.error('❌ No organizers found. Run seedUsers.js first.');
            return;
        }
        console.log(`👤 Found ${organizers.length} organizer(s)`);

        // Fetch all temples
        const temples = await Temple.find({}).sort({ name: 1 });
        if (temples.length === 0) {
            console.error('❌ No temples found in DB. Please add temples first.');
            return;
        }
        console.log(`🛕  Found ${temples.length} temple(s)\n`);

        console.log('─── Assignments ──────────────────────────────────────────');

        for (let i = 0; i < temples.length; i++) {
            // Cycle through organizers if there are more temples than organizers
            const organizer = organizers[i % organizers.length];
            await Temple.findByIdAndUpdate(temples[i]._id, { organizer: organizer._id });
            console.log(`   🛕  "${temples[i].name}"`);
            console.log(`       → ${organizer.email}\n`);
        }

        console.log('─────────────────────────────────────────────────────────');
        console.log('🎉 All temples assigned to organizers successfully!');
        console.log('\n📋 Summary:');
        console.log('   Each organizer can now CREATE SLOTS and MANAGE BOOKINGS');
        console.log('   for their assigned temple(s).');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

assignOrganizers();
