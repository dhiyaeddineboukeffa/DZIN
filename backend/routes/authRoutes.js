const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;

        // Simple admin check (In production, use proper username/password from DB)
        // For this demo, we'll match the hardcoded "admin123" or check against a seeded admin user

        // Check against seeded admin
        const adminUser = await User.findOne({ role: 'admin' });
        console.log('Login attempt for:', 'admin');
        console.log('Found user:', adminUser ? adminUser.username : 'NULL');
        if (adminUser) console.log('Stored Hash:', adminUser.passwordHash);

        let isValid = false;
        if (adminUser) {
            isValid = await bcrypt.compare(password, adminUser.passwordHash);
            console.log('Hash Comparison Result:', isValid);
        }

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, role: 'admin' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
