const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'organizer', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/darshanease';

// ─── Passwords ──────────────────────────────────────────────────────────────
const ORGANIZER_PASSWORD = 'Organizer@123';
const ADMIN_PASSWORD = 'Admin@123';
const USER_PASSWORD = 'User@123';

// ─── Seed Data ───────────────────────────────────────────────────────────────
const users = [
    // 7 Organizers
    { name: 'Organizer 1', email: 'organizer1@organize.com', password: ORGANIZER_PASSWORD, role: 'organizer' },
    { name: 'Organizer 2', email: 'organizer2@organize.com', password: ORGANIZER_PASSWORD, role: 'organizer' },
    { name: 'Organizer 3', email: 'organizer3@organize.com', password: ORGANIZER_PASSWORD, role: 'organizer' },
    { name: 'Organizer 4', email: 'organizer4@organize.com', password: ORGANIZER_PASSWORD, role: 'organizer' },
    { name: 'Organizer 5', email: 'organizer5@organize.com', password: ORGANIZER_PASSWORD, role: 'organizer' },
    { name: 'Organizer 6', email: 'organizer6@organize.com', password: ORGANIZER_PASSWORD, role: 'organizer' },
    { name: 'Organizer 7', email: 'organizer7@organize.com', password: ORGANIZER_PASSWORD, role: 'organizer' },

    // 1 Admin
    { name: 'Admin 1', email: 'admin1@admin.com', password: ADMIN_PASSWORD, role: 'admin' },

    // 3 Users
    { name: 'User 1', email: 'user1@user.com', password: USER_PASSWORD, role: 'user' },
    { name: 'User 2', email: 'user2@user.com', password: USER_PASSWORD, role: 'user' },
    { name: 'User 3', email: 'user3@user.com', password: USER_PASSWORD, role: 'user' },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB:', MONGO_URI);

        // Clear all existing users before re-seeding
        const deleted = await User.deleteMany({});
        console.log(`🗑️  Cleared ${deleted.deletedCount} existing user(s)\n`);

        const salt = await bcrypt.genSalt(10);

        for (const u of users) {
            const hashed = await bcrypt.hash(u.password, salt);
            await User.create({ ...u, password: hashed });
            console.log(`   ✔  Created [${u.role.padEnd(9)}] ${u.email}`);
        }

        console.log('\n🎉 All users seeded successfully!\n');
        console.log('─────────────────────────────────────────────');
        console.log('  ORGANIZERS  organizer1-7@organize.com  →  Organizer@123');
        console.log('  ADMIN       admin1@admin.com            →  Admin@123');
        console.log('  USERS       user1-3@user.com            →  User@123');
        console.log('─────────────────────────────────────────────');
    } catch (err) {
        if (err.code === 11000) {
            console.error('❌ Duplicate email detected — some users may already exist. Clear the collection first.');
        } else {
            console.error('❌ Error:', err.message);
        }
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();
