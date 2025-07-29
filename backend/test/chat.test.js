jest.setTimeout(20000); // Timeout global para todos los tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';
require('dotenv').config();
const supertest = require('supertest');
jest.mock('../src/services/chatService', () => ({
  getChatResponse: async () => 'Respuesta mockeada del modelo'
}));

let knex;

beforeAll(async () => {
  // Ejecuta migraciones para crear las tablas
  knex = require('../src/db');
  await knex.migrate.latest();
  const fastify = require('fastify')();
  global.fastify = fastify;
  const authRoutes = require('../src/routes/auth');
  const chatRoutes = require('../src/routes/chat');
  await fastify.register(authRoutes);
  await fastify.register(chatRoutes);
  await fastify.listen({ port: 0 });
  const address = fastify.server.address();
  global.request = supertest(`http://127.0.0.1:${address.port}`);
  await global.request
    .post('/register')
    .send({ username: 'chatuser', password: 'chatpass' });
  const res = await global.request
    .post('/login')
    .send({ username: 'chatuser', password: 'chatpass' });
  global.token = res.body.token;
});

afterAll(async () => {
  await global.fastify.close();
  if (knex) await knex.destroy();
});

describe('Chat endpoint', () => {
  test('Chat requires auth', async () => {
    const res = await global.request
      .post('/chat')
      .send({ message: 'Hola' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toBeDefined();
  });

  test('Chat with token returns response', async () => {
    const res = await global.request
      .post('/chat')
      .set('Authorization', `Bearer ${global.token}`)
      .send({ message: 'Hola' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.response).toBeDefined();
  });

  test('Chat with token returns mock text', async () => {
    const res = await global.request
      .post('/chat')
      .set('Authorization', `Bearer ${global.token}`)
      .send({ message: 'Hola' });
    expect(res.body.response).toBe('Respuesta mockeada del modelo');
  });
});
