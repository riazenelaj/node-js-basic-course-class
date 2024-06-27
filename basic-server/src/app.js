
const {itemRoutes} = require("./routes/v1/items");
const {booksRoutes} = require("./routes/v1/books");
const swaggerUi = require("@fastify/swagger-ui");
const swagger = require("@fastify/swagger");
const auth = require('./plugins/auth');
const dbconnector = require('./db')
const fastify = require('fastify');
const fastifyPostgres = require('fastify-postgres');



const build = (opts = {}, swaggerOpts={}) => {
    const app = fastify(opts);
    app.get('/', async (request, reply) => {
    return { message: 'Welcome to Server!' };
  });
 

  app.register(auth); 
  app.register(fastifyPostgres, {
    connectionString: 'postgres://student:student@localhost:5432/library'
});
  app.register(dbconnector);
  app.register(swagger);
  app.register(swaggerUi, swaggerOpts)
  app.register(booksRoutes);
  return app;
}

module.exports = {build};