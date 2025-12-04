const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { authenticateAdmin } = require('../middleware/auth');

// Get all coupons
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a coupon
router.post('/', authenticateAdmin, async (req, res) => {
    const coupon = new Coupon({
        code: req.body.code,
        discountType: req.body.discountType,
        discountValue: req.body.discountValue,
        isActive: req.body.isActive
    });

    try {
        const newCoupon = await coupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a coupon
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Validate a coupon
router.post('/validate', async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or expired coupon code' });
        }

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
