const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const products = await Product.find({ name: { $regex: 'KIMITSU', $options: 'i' } });

        if (products.length === 0) {
            console.log('No product found matching "KIMITSU"');
        } else {
            products.forEach(p => {
                console.log(`Product: ${p.name}`);
                console.log(`ID: ${p._id}`);
                console.log(`Image (Main): ${p.image}`);
                console.log(`Images Array:`, p.images);
                console.log(`Images Count: ${p.images ? p.images.length : 0}`);
                console.log('---');
            });
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkImages();
