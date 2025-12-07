const bcrypt = require('bcryptjs');

async function generate() {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123', salt);
    console.log('HASH 123:', hash);
}

generate();
