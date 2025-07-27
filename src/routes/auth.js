// Auth routes: register & login
const fp = require('fastify-plugin');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hash');
const { createUser, findUserByUsername } = require('../models/userModel');
const { res } = require('pino-std-serializers');

module.exports = fp(async function (fastify, opts) {
  fastify.post('/register', async (request, reply) => {
    const { username, password } = request.body;
    if (!username || !password) {
        fastify.log.error('LOG --- Username and password are required', request.body, request);
      return reply.code(400).send({ success: false, message: 'Username and password required' });
    }
    const existing = await findUserByUsername(username);
    if (existing) {
      return reply.code(409).send({ success: false, message: 'User already exists' });
    }
    const passwordHash = await hashPassword(password);
    await createUser(username, passwordHash);
    reply.send({ success: true, message: 'User registered' });
  });

  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;
    if (!username || !password) {
      return reply.code(400).send({ success: false, message: 'Username and password required' });
    }
    const user = await findUserByUsername(username);
    if (!user) {
      return reply.code(401).send({ success: false, message: 'Invalid credentials' });
    }
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return reply.code(401).send({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    reply.send({ success: true, token });
  });
});
