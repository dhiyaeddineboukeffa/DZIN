fetch('http://localhost:5000/api/wilayas')
    .then(res => {
        console.log('Status:', res.status);
        return res.text();
    })
    .then(text => console.log('Body:', text))
    .catch(err => console.error('Fetch Error:', err));
