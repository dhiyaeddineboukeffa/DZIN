// Using native fetch
// Actually, modern node has fetch.

async function testLogin() {
    try {
        console.log('Attempting login with admin123...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'admin123' })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', data);

    } catch (error) {
        console.error('Error:', error);
    }
}

testLogin();
