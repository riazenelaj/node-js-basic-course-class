const bookSchema = {
    body: {
        type: 'object',
        required: ['title', 'author', 'isbn', 'publicationyear'],
        properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            isbn: { type: 'string' },
            publicationyear: { type: 'string' }
        }
    }
};

module.exports = { bookSchema };