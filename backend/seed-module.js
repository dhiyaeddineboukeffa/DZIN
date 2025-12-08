const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Wilaya = require('./models/Wilaya');
const bcrypt = require('bcryptjs');

const PRODUCTS = [
    {
        name: 'DZIN x AKIRA: Neo-Algiers Hoodie',
        price: 8500,
        category: 'Hoodies',
        image: '/products/hoodie.png',
        description: 'Heavyweight cotton hoodie featuring cyber-enhanced Algiers cityscape. Limited edition drop.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Gray'],
        inStock: true,
        featured: true,
    },
    {
        name: 'Cyber-Rai: Track Jacket',
        price: 6500,
        category: 'Streetwear',
        image: '/products/jacket.png',
        description: 'Reflective piping with traditional Rai music iconography reimagined for 2077.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Gray'],
        inStock: true,
        featured: true,
    },
    {
        name: 'Mecha-Fennec Tee',
        price: 3500,
        category: 'Anime',
        image: '/products/tee.png',
        description: 'Oversized fit tee with mecha-fennec fox illustration. 100% organic cotton.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Gray'],
        inStock: true,
        featured: false,
    },
    {
        name: 'Casbah Glitch Cargo Pants',
        price: 7000,
        category: 'Streetwear',
        image: '/products/cargo.png',
        description: 'Tactical cargo pants with glitch-pattern embroidery. Multiple utility pockets.',
        sizes: ['30', '32', '34', '36'],
        colors: ['Black', 'White', 'Gray'],
        inStock: true,
        featured: false,
    },
    {
        name: 'Urban-Judo Gi: Street Edition',
        price: 9000,
        category: 'Sportswear',
        image: '/products/judo-gi.png',
        description: 'Reinforced denim Gi adapted for street wear. Features DZIN radical calligraphy.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Gray'],
        inStock: true,
        featured: true,
    }
];

const WILAYAS = [
    { code: 1, name: 'Adrar', communes: ['Adrar', 'Tamest', 'Charouine'] },
    { code: 4, name: 'Oum El Bouaghi', communes: ['Oum El Bouaghi', 'Ain Beida', 'Ain M\'lila', 'Sigus'] },
    { code: 16, name: 'Algiers', communes: ['Algiers Centre', 'Sidi M\'Hamed', 'El Biar', 'Hydra', 'Bab El Oued'] },
    { code: 25, name: 'Constantine', communes: ['Constantine', 'El Khroub', 'Ain Smara'] },
    { code: 31, name: 'Oran', communes: ['Oran', 'Es Senia', 'Bir El Djir'] }
];

const seedDB = async () => {
    try {
        console.log('Starting Web Seed...');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        await Wilaya.deleteMany({});
        console.log('Cleared old data');

        // Seed Products
        await Product.insertMany(PRODUCTS);
        console.log('Products Seeded');

        // Seed Wilayas
        await Wilaya.insertMany(WILAYAS);
        console.log('Wilayas Seeded');

        // Seed Admin User
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('kavebob', salt);

        await User.create({
            username: 'admin',
            email: 'admin@dzin.com',
            passwordHash,
            role: 'admin'
        });
        console.log('Admin User Seeded (kavebob)');

        return true;
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

module.exports = seedDB;
