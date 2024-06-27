const axios = require('axios');

const postBook = async () => {
    try {
        const response = await axios.put('http://localhost:5000/books/15', {
            title: 'Update15',
            author: 'Updated15',
            isbn: '22222',
            publicationyear: '2021'
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