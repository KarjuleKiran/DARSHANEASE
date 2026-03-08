const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Temple = require('../src/models/Temple');
const Slot = require('../src/models/Slot');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing
        await User.deleteMany();
        await Temple.deleteMany();
        await Slot.deleteMany();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Create an Admin
        const admin = await User.create({
            name: 'Main Admin',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Create 7 Organizers
        const organizers = [];
        for (let i = 1; i <= 7; i++) {
            const org = await User.create({
                name: `Organizer ${i}`,
                email: `org${i}@test.com`,
                password: hashedPassword,
                role: 'organizer'
            });
            organizers.push(org);
        }

        const templesData = [
            {
                name: 'Shreemant Dagdusheth Halwai Ganpati',
                location: 'Budhwar Peth, Pune',
                description: 'One of the most revered Ganesha temples in India, famous for its grand golden idol and vibrant celebrations.',
                darshanHours: { start: '06:00 AM', end: '11:00 PM' },
                imageUrl: '/dagduseth.jpg',
                mapLink: 'https://www.google.com/maps/place/Dagdusheth+Halwai+Ganpati+Temple/',
                organizer: organizers[0]._id,
                approved: true
            },
            {
                name: 'Kasba Ganpati',
                location: 'Kasba Peth, Pune',
                description: 'The first "Manache Ganpati" of Pune, established by Jijabai. It is the presiding deity of Pune city.',
                darshanHours: { start: '06:00 AM', end: '09:00 PM' },
                imageUrl: '/kasba.jpg',
                mapLink: 'https://www.google.com/maps/place/Kasba+Ganpati+Mandir/',
                organizer: organizers[1]._id,
                approved: true
            },
            {
                name: 'Laxmi Narasimha Temple',
                location: 'Sadashiv Peth, Pune',
                description: 'A beautiful temple dedicated to Lord Narasimha, known for its tranquil atmosphere and intricate carvings.',
                darshanHours: { start: '07:00 AM', end: '08:30 PM' },
                imageUrl: '/narasimha.jpg',
                mapLink: 'https://www.google.com/maps/search/Laxmi+Narasimha+Temple+Pune',
                organizer: organizers[2]._id,
                approved: true
            },
            {
                name: 'Neelkanteshwar Temple',
                location: 'Panshet, Maharashtra',
                description: 'Situated on a hill, this temple is famous for hundreds of beautiful sculptures depicting Hindu mythology.',
                darshanHours: { start: '05:00 AM', end: '07:00 PM' },
                imageUrl: '/neelkanteshwar.jpg',
                mapLink: 'https://maps.app.goo.gl/3U5s1DGdqnZDzMBt5',
                organizer: organizers[3]._id,
                approved: true
            },
            {
                name: 'Omkareshwar Mandir',
                location: 'Shaniwar Peth, Pune',
                description: 'A historic temple from the Peshwa era dedicated to Lord Shiva, located on the banks of Mutha river.',
                darshanHours: { start: '05:30 AM', end: '10:00 PM' },
                imageUrl: '/omkareshwar.jpg',
                mapLink: 'https://www.google.com/maps/place/Shree+Omkareshwar+Temple,+Pune/',
                organizer: organizers[4]._id,
                approved: true
            },
            {
                name: 'Parvati Hill Temple',
                location: 'Parvati Hill, Pune',
                description: 'One of the oldest heritage structures in Pune, offering a panoramic view of the city from its summit.',
                darshanHours: { start: '05:00 AM', end: '08:00 PM' },
                imageUrl: '/parvati.jpg',
                mapLink: 'https://www.google.com/maps/place/Parvati+Hill/',
                organizer: organizers[5]._id,
                approved: true
            },
            {
                name: 'Tirupati Balaji Temple',
                location: 'Tirumala, Andhra Pradesh',
                description: 'One of the most visited religious sites in the world, dedicated to Lord Venkateswara.',
                darshanHours: { start: '04:00 AM', end: '11:00 PM' },
                imageUrl: '/temple-placeholder.png',
                mapLink: 'https://www.google.com/maps/place/Tirumala+Tirupati+Devasthanams/',
                organizer: organizers[6]._id,
                approved: true
            }
        ];

        const createdTemples = await Temple.insertMany(templesData);

        // Helper function to format time
        const formatTime = (minutes) => {
            let h = Math.floor(minutes / 60);
            let m = minutes % 60;
            let ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12; // 0 should be 12
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        };

        // Create 10-minute slots for each temple
        const slots = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        createdTemples.forEach(temple => {
            // Full day: 6:00 AM to 9:00 PM (360 mins to 1260 mins)
            for (let time = 360; time < 1260; time += 10) {
                slots.push({
                    templeId: temple._id,
                    date: today,
                    timeRange: {
                        start: formatTime(time),
                        end: formatTime(time + 10)
                    },
                    maxSeats: 20,
                    bookedSeats: 0,
                    pricePerPerson: 50
                });
            }
        });

        await Slot.insertMany(slots);

        console.log(`Database Seeded Successfully! Added ${createdTemples.length} temples, 7 unique organizers, and ${slots.length} slots. 🕉️`);
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
