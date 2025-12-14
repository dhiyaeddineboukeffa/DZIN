require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

console.log('--- DB DATA CHECK ---');
console.log('URI:', process.env.MONGODB_URI);

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to DB.');

        const count = await Product.countDocuments({});
        console.log('Total Products:', count);

        if (count > 0) {
            const products = await Product.find({}).limit(1);
            console.log('Sample Product 1:', JSON.stringify(products[0], null, 2));

            // Check specific Hoodie
            const hoodie = await Product.findOne({ name: /Hoodie/i });
            if (hoodie) {
                console.log('Hoodie Found:', JSON.stringify(hoodie, null, 2));
                console.log('Hoodie Discount:', hoodie.discountPrice);
            } else {
                console.log('Hoodie NOT Found.');
            }
        } else {
            console.log('WARNING: No products find in collection.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

check();
