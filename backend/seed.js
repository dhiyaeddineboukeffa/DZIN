const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedDB = require('./seed-module');

dotenv.config({ path: __dirname + '/.env' });

const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        console.log('Running Seed...');
        await seedDB();

        console.log('Seeding Complete');
        process.exit();
    } catch (error) {
        console.error('Error running seed:', error);
        process.exit(1);
    }
};

runSeed();
