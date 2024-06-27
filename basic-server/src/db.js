const fastifyPlugin = require('fastify-plugin') 
require('dotenv').config() 
const { Client } = require('pg') 

const client = new Client({ 
    user: 'student', 
    password:process.env.PASSWORD, 
    host: '127.0.0.1', 
    port: 5432, 
    database: 'library' 
}) 
async function dbconnector(fastify, options) { 
    try { 
        await client.connect() 
        console.log("db connected succesfully") 
        fastify.decorate('db', {client}) 
    } catch(err) { 
        console.error(err) 
    } 
} 
module.exports= fastifyPlugin(dbconnector)