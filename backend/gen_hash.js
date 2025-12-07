const bcrypt = require('bcryptjs');

async function generate() {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('kavebob', salt);
    console.log('HASH:', hash);
}

generate();
