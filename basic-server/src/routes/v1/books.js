const {bookSchema } = require("../../schema/books/books")



const booksRoutes = (fastify, options, done) => {

    fastify.get("/books", { preValidation: [fastify.authenticate] }, async (request, reply) => {
       console.log("user",request.user);
      
        // console.log("request", request.query)
        const { filterBy, filterValue, sort, pageNumber = 1} = request.query;

        const limit = 10;
        const offset = (pageNumber-1) * limit;
        const client = await fastify.pg.connect();

        let query = 'SELECT * FROM books WHERE 1=1';
        const params = [];
        console.log(sort)

        if (filterBy === "author") {
            params.push(filterValue);
            console.log(filterValue)
            query += ` AND author = $${params.length}`;
        }

        if (filterBy === "publicationyear") {
            params.push(filterValue);
            query += ` AND publicationyear = $${params.length}`;
        }
        if (sort) {
            // params.push(sort);
            query += ` ORDER BY publicationyear ${sort}`;
        }

        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
params.push(limit, offset);
        try {
            console.log("query", query);
            const { rows } = await client.query(query, params);
            reply.send(rows);
        } catch (error) {
            reply.code(500).send({ error: 'Database error', details: error.message });
        } finally {
            client.release();
        }
    });

    fastify.post("/books", { schema: bookSchema , preValidation: [fastify.authenticate]}, async (request, reply) => {

        if (request.user.role !== 'admin') {
            reply.code(500).send({ error: 'Not authenticated as admin to do this request'});
           }

        const { title, author, isbn, publicationyear } = request.body;
        const client = await fastify.pg.connect();

        try {
            const { rows } = await client.query(
                'INSERT INTO books (title, author, isbn, "publicationyear") VALUES ($1, $2, $3, $4) RETURNING *',
                [title, author, isbn, publicationyear]
            );
            reply.code(201).send(rows[0]);
        } catch (error) {
            reply.code(500).send({ error: 'Database error', details: error.message });
        } finally {
            client.release();
        }
    });
    // fastify.get("/books", async(request, reply) => {
    //     console.log("im hereeee");
    //     const client = await fastify.pg.connect();
    //     try {
    //         const { rows } = await client.query('SELECT * FROM books');
    //         if (rows.length === 0) {
    //             reply.code(404).send({ error: 'Book not found' });
    //         } else {
    //             reply.send(rows);
    //         }
    //     } finally {
    //         client.release();
    //     }
    // });
    fastify.delete("/books/:id", async (request, reply) => {
        const { id } = request.params;
        const client = await fastify.pg.connect();

        try {
            const result = await client.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
            if (result.rowCount === 0) {
                reply.code(404).send({ error: 'Book not found' });
            } else {
                reply.code(204).send();
            }
        } catch (error) {
            reply.code(500).send({ error: 'Database error', details: error.message });
        } finally {
            client.release();
        }
    });

    fastify.put("/books/:id",  async (request, reply) => {
        const { id } = request.params;
        const { title, author, isbn, publicationyear } = request.body;
        const client = await fastify.pg.connect();
        try {
            const { rows } = await client.query(
                'UPDATE books SET title = $1, author = $2, isbn = $3, publicationyear = $4 WHERE id = $5 RETURNING *',
                [title, author, isbn, publicationyear, id]
            );
            if (rows.length === 0) {
                reply.code(404).send({ error: 'Book not found' });
            } else {
                reply.send(rows[0]);
            }
        } finally {
            client.release();
        }
    } );

    fastify.get("/books/:id", async (request, reply) => {
                    const { id } = request.params;
                    const client = await fastify.pg.connect();
                    try {
                        const { rows } = await client.query('SELECT * FROM books WHERE id = $1', [id]);
                        if (rows.length === 0) {
                            reply.code(404).send({ error: 'Book not found' });
                        } else {
                            reply.send(rows[0]);
                        }
                    } finally {
                        client.release();
}});

    done();
}


module.exports = {booksRoutes};

