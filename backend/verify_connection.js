const mongoose = require('mongoose');

// Get URI from command line argument
const uri = process.argv[2];

if (!uri) {
    console.error('Usage: node verify_connection.js <mongodb_uri>');
    process.exit(1);
}

console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(uri)
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB!');
        console.log('Credentials and Network Access are correct.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ FAILURE: Could not connect.');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);

        if (err.message.includes('bad auth')) {
            console.log('\n👉 TIP: Your PASSWORD or USERNAME is incorrect.');
        } else if (err.message.includes('whitelist') || err.name === 'MongooseServerSelectionError') {
            console.log('\n👉 TIP: Your IP address is BLOCKED.');
            console.log('   Go to Atlas -> Network Access -> Add IP Address -> Allow Access From Anywhere (0.0.0.0/0)');
        }
        process.exit(1);
    });
