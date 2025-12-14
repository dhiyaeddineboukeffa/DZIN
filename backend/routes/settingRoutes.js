const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { authenticateAdmin } = require('../middleware/auth');

// GET Public Setting by Key
router.get('/:key', async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: req.params.key });
        if (!setting) {
            // Return defaults if not found so frontend doesn't crash
            if (req.params.key === 'manifesto_video') {
                return res.json({ value: '', isPublic: true });
            }
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT Update Setting (Admin Only)
router.put('/:key', authenticateAdmin, async (req, res) => {
    try {
        const { value, description, isPublic } = req.body;

        const setting = await Setting.findOneAndUpdate(
            { key: req.params.key },
            {
                value,
                description,
                isPublic: isPublic !== undefined ? isPublic : true
            },
            { new: true, upsert: true } // Create if doesn't exist
        );

        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
