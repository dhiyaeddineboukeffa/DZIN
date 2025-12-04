const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';

async function testDelete() {
    console.log('Testing DELETE endpoints...');

    // 1. Create a dummy product
    console.log('Creating dummy product...');
    const productRes = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'DELETE_TEST_PRODUCT',
            category: 'Streetwear',
            price: 1000,
            description: 'Test',
            sizes: ['S'],
            image: 'http://example.com/image.png'
        })
    });
    const product = await productRes.json();
    console.log('Created Product ID:', product._id);

    // 2. Delete the product
    console.log('Deleting product...');
    const deleteRes = await fetch(`${BASE_URL}/products/${product._id}`, {
        method: 'DELETE'
    });
    console.log('Delete Product Status:', deleteRes.status);
    const deleteJson = await deleteRes.json();
    console.log('Delete Product Response:', deleteJson);

    if (deleteRes.status === 200) {
        console.log('✅ Product DELETE working');
    } else {
        console.error('❌ Product DELETE failed');
    }
}

testDelete();
