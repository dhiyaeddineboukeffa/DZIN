const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function testUpload() {
    try {
        // Create dummy file
        fs.writeFileSync('test_image.jpg', 'dummy content');

        const form = new FormData();
        form.append('name', 'Test Upload Product');
        form.append('category', 'Hoodies');
        form.append('price', 1000);
        form.append('image', fs.createReadStream('test_image.jpg'));
        form.append('sizes', 'S,M');

        const response = await axios.post('http://localhost:5000/api/products', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Upload Status:', response.status);
        console.log('Product Image URL:', response.data.image);
    } catch (error) {
        console.error('Upload Failed:', error.response ? error.response.data : error.message);
    }
}

testUpload();
