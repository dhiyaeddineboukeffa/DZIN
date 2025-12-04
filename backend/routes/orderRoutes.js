const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST Create Order
router.post('/', async (req, res) => {
    try {
        const { customer, items, totalAmount, subtotal, deliveryFee, coupon } = req.body;

        const order = new Order({
            orderId: `ORD-${Date.now()}`,
            customer,
            items,
            subtotal,
            deliveryFee,
            coupon,
            totalAmount
        });

        await order.save();
        res.status(201).json({ success: true, orderId: order.orderId });
    } catch (error) {
        res.status(400).json({ message: 'Order creation failed', error: error.message });
    }
});

// GET All Orders (Admin only)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT Update Order (Status or Full Update)
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
});

// DELETE Order
router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
});

module.exports = router;
