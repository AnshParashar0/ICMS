const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Worker = require('../models/Worker');

async function seedDatabase() {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ Error: MONGO_URI is not defined in your .env file');
            process.exit(1);
        }

        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB successfully.');

        // 1. Seed or Update Default Admin User
        const adminEmail = 'admin@icms.com';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        let admin = await User.findOne({ email: adminEmail });
        if (admin) {
            admin.role = 'ADMIN';
            admin.password = hashedPassword;
            await admin.save();
            console.log(`ℹ️  Admin user (${adminEmail}) already exists. Updated password to: admin123`);
        } else {
            admin = new User({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                contact_number: '+91 9876543210'
            });
            await admin.save();
            console.log(`✅ Default admin created successfully!`);
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Password: admin123`);
        }

        // 2. Seed Sample Worker if none exist
        const workerCount = await Worker.countDocuments();
        if (workerCount === 0) {
            const sampleWorkers = [
                {
                    name: 'Rajesh Kumar',
                    department: 'Electrical',
                    phone: '+91 9876500001',
                    email: 'rajesh.elec@icms.com',
                    status: 'AVAILABLE'
                },
                {
                    name: 'Suresh Verma',
                    department: 'Plumbing',
                    phone: '+91 9876500002',
                    email: 'suresh.plumb@icms.com',
                    status: 'AVAILABLE'
                },
                {
                    name: 'Vikram Singh',
                    department: 'Carpentry',
                    phone: '+91 9876500003',
                    email: 'vikram.carp@icms.com',
                    status: 'AVAILABLE'
                }
            ];
            await Worker.insertMany(sampleWorkers);
            console.log(`✅ Seeded ${sampleWorkers.length} sample maintenance workers.`);
        } else {
            console.log(`ℹ️  Workers collection already has ${workerCount} entries. Skipping worker seed.`);
        }

        console.log('\n🎉 Database seeding completed successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();
