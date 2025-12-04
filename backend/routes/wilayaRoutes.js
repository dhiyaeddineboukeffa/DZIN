const express = require('express');
const router = express.Router();
const Wilaya = require('../models/Wilaya');
const { authenticateAdmin } = require('../middleware/auth');

// GET All Wilayas
router.get('/', async (req, res) => {
    try {
        const wilayas = await Wilaya.find().sort({ code: 1 });
        res.json(wilayas);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST Add Wilaya (Admin)
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const wilaya = new Wilaya(req.body);
        await wilaya.save();
        res.status(201).json(wilaya);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// DELETE Wilaya (Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        await Wilaya.findByIdAndDelete(req.params.id);
        res.json({ message: 'Wilaya deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
