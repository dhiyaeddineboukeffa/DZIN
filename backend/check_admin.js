const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const adminUser = await User.findOne({ role: 'admin' });

        if (adminUser) {
            console.log('Admin user found:', adminUser.username);
            console.log('Email:', adminUser.email);

            const isMatch = await bcrypt.compare('admin123', adminUser.passwordHash);
            console.log('Password "admin123" matches:', isMatch);
        } else {
            console.log('No admin user found.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();
