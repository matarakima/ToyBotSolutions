require('dotenv').config();
const fastify = require('fastify')();
const authRoutes = require('../src/routes/auth');
const knex = require('../src/db');
const supertest = require('supertest');

beforeAll(async () => {
  await knex.migrate.latest();
  await fastify.register(authRoutes);
  await knex('users').del(); // Limpiar usuarios
  await fastify.listen({ port: 0 });
});

afterAll(async () => {
  await fastify.close();
  await knex.destroy();
});

describe('Auth endpoints', () => {
  test('Register user', async () => {
    const res = await supertest(fastify.server)
      .post('/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.body.success).toBe(true);
  });

  test('Login user', async () => {
    const res = await supertest(fastify.server)
      .post('/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});
