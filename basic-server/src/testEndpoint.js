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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE5NDk5OTE5LCJleHAiOjE3MTk1MDM1MTl9.WNS66pUyIaL2ghSgndnwHPbGg02eo5hkGwMw-AoQzMA'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error posting book:', error.response ? error.response.data : error.message);
    }
};

postBook();