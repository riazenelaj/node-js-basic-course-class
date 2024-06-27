const axios = require('axios');

const postBook = async () => {
    try {
        const response = await axios.post('http://localhost:5000/books',  {
        title: 'Book 1',
        author: 'newAuthor',
        isbn: '1234567890',
        publicationyear: '2222'
    }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error posting book:', error.response ? error.response.data : error.message);
    }
};

postBook();