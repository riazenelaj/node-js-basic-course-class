// plugins/auth.js
const fp = require('fastify-plugin');
const jwt = require('fastify-jwt');
const bcrypt = require('bcrypt');

const users = [];

async function auth(fastify, opts) {
  fastify.register(require('fastify-jwt'), {
    secret: 'supersecret' // Replace with your secret key
  });

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.post('/signup', async (request, reply) => {
    const { username, password, role } = request.body;
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
      return reply.code(400).send({ message: 'User already exists' });
    }

    if (!['admin', 'user'].includes(role)) {
      return reply.code(400).send({ message: 'Role must be either admin or user' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword, role });
    reply.code(201).send({ message: 'User registered successfully' });
  });

//   fastify.post('/login', async (request, reply) => {
//     const { username, password } = request.body;
//     // Replace with your actual user authentication logic
//     if (username === 'admin' && password === 'password') {
//       const token = fastify.jwt.sign({ username });
//       return { token };
//     }
//     reply.code(401).send({ message: 'Invalid credentials' });
//   });

// fastify.post('/login', async (request, reply) => {
//     const { username, password } = request.body;
//     // Replace with your actual user authentication logic
//     if (username === 'admin' && password === 'password') {
//       const token = fastify.jwt.sign({ username }, { expiresIn: '1h' }); // Token expires in 1 hour
//       return { token };
//     }
//     reply.code(401).send({ message: 'Invalid credentials' });
//   });
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;
    const user = users.find(user => user.username === username);

    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ username: user.username, role: user.role }, { expiresIn: '1h' });
    reply.send({ token });
  });
}

module.exports = fp(auth);
