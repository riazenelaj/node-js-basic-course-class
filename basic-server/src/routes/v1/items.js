const {getItemsOptions} = require("../../schema/items/items")
const items = [
    {id: 1, name: "test", description: "hahaha"},
    {id: 2, name: "test", description: "hahaha"},
    {id: 3, name: "test", description: "hahaha"}
]

const itemRoutes = (fastify, options, done) => {
    fastify.get("/items", (request, reply) => {
            return items;
    });

    fastify.get("/items/:id", getItemsOptions, (request, reply) => {
        const { id } = request.params;
        const item = items.find(o => o.id === parseInt(id));
        if (item) {
            reply.send(item);
        } else {
            reply.status(404).send({ message: "Item not found" });
        }
    });
    done();
}


module.exports = {itemRoutes};


