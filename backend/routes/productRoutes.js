const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { authenticateAdmin } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'dzin-shop', // The folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

// GET All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET Product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST Create Product (Admin only)
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
    console.log('========================================');
    console.log('POST /api/products called');
    console.log('Headers:', req.headers['content-type']);
    console.log('Body:', req.body);
    console.log('Body keys:', Object.keys(req.body));
    console.log('File:', req.file);
    console.log('========================================');

    try {
        const productData = req.body;

        // Log each field
        console.log('Product data fields:');
        console.log('  name:', productData.name);
        console.log('  category:', productData.category);
        console.log('  price:', productData.price);
        console.log('  description:', productData.description);
        console.log('  sizes:', productData.sizes);

        if (req.file) {
            productData.image = req.file.path; // Cloudinary URL
            console.log('  image path:', productData.image);
        } else {
            console.log('  NO FILE UPLOADED!');
        }

        // Parse sizes if it's a string (from FormData)
        if (typeof productData.sizes === 'string') {
            productData.sizes = productData.sizes.split(',').map(s => s.trim());
        }

        // Parse colors if it's a string
        if (typeof productData.colors === 'string' && productData.colors.trim()) {
            productData.colors = productData.colors.split(',').map(c => c.trim()).filter(c => c.length > 0);
        }

        // Parse images if present
        if (productData.images) {
            if (typeof productData.images === 'string') {
                try {
                    productData.images = JSON.parse(productData.images);
                } catch (e) {
                    productData.images = productData.images.split(',').map(s => s.trim());
                }
            }
            if (Array.isArray(productData.images) && productData.images.length > 0) {
                productData.image = productData.images[0];
            }
        }

        console.log('Creating product with data:', productData);
        const product = new Product(productData);
        await product.save();
        console.log('✅ Product saved successfully:', product.name);
        res.status(201).json(product);
    } catch (error) {
        console.error('❌ Error creating product:', error.message);
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// PUT Update Product (Admin only)
router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
    try {
        const updates = req.body;

        // Handle file upload if present (legacy support or if we add file upload back)
        if (req.file) {
            updates.image = req.file.path;
        }

        // Parse sizes if it's a string
        if (typeof updates.sizes === 'string') {
            updates.sizes = updates.sizes.split(',').map(s => s.trim());
        }

        // Parse colors if it's a string
        if (typeof updates.colors === 'string') {
            updates.colors = updates.colors.split(',').map(c => c.trim()).filter(c => c.length > 0);
        }

        // Parse images if present
        if (updates.images) {
            if (typeof updates.images === 'string') {
                try {
                    updates.images = JSON.parse(updates.images);
                } catch (e) {
                    updates.images = updates.images.split(/[\n,]+/).map(s => s.trim());
                }
            }
            // Ensure derived 'image' field is updated if images array changes
            if (Array.isArray(updates.images) && updates.images.length > 0) {
                updates.image = updates.images[0];
            }
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('Update failed:', error);
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
});

// DELETE Product (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
