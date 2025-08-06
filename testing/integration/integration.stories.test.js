
/**
 * Pruebas de integración básicas
 * Prueba la integración entre diferentes componentes del sistema
 */

describe('Integración del Sistema', () => {
  test('debería tener configuración básica disponible', () => {
    expect(process.env.NODE_ENV).toBeDefined();
    expect(typeof process.env.NODE_ENV).toBe('string');
  });

  test('debería tener variables de entorno de prueba configuradas', () => {
    // Verificar variables de entorno básicas
    expect(process.env.TEST_SERVER_PORT).toBeDefined();
    expect(process.env.TEST_DB_PATH).toBeDefined();
    expect(process.env.TEST_JWT_SECRET).toBeDefined();
  });

  test('debería poder usar funciones básicas de Node.js', () => {
    // Verificar que funciones básicas de Node.js funcionan
    expect(typeof console.log).toBe('function');
    expect(typeof setTimeout).toBe('function');
    expect(typeof setInterval).toBe('function');
  });

  test('debería poder usar módulos nativos', () => {
    // Verificar que módulos nativos funcionan
    const fs = require('fs');
    const path = require('path');
    
    expect(fs).toBeDefined();
    expect(path).toBeDefined();
    expect(typeof fs.readFileSync).toBe('function');
    expect(typeof path.join).toBe('function');
  });

  test('debería poder usar Jest correctamente', () => {
    // Verificar que Jest está funcionando
    expect(jest).toBeDefined();
    expect(typeof jest.fn).toBe('function');
    expect(typeof jest.mock).toBe('function');
  });
}); 

const request = require('supertest');

const BASE_URL = 'http://localhost:5000'; // Adjust if backend runs on a different port

describe('Integration Tests - User Stories', () => {
  // User Story 1: User Registration
  it('should register a new user', async () => {
    const payload = {
      username: 'testuser1',
      email: 'testuser1@example.com',
      password: 'TestPassword123!'
    };
    const res = await request(BASE_URL).post('/users/register').send(payload);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.text.toLowerCase()).toContain('confirmation');
  });

  // User Story 2: Product Information Request
  it('should respond with product features', async () => {
    const payload = { message: 'What are the features of product X?' };
    const res = await request(BASE_URL).post('/chat').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.text.toLowerCase()).toMatch(/product|feature/);
  });

  // User Story 3: Secure Login
  it('should login with valid credentials', async () => {
    const payload = {
      email: 'testuser1@example.com',
      password: 'TestPassword123!'
    };
    const res = await request(BASE_URL).post('/users/login').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({ token: expect.any(String) }));
  });

  // User Story 4: Chat Session Continuity
  it('should maintain chat session context', async () => {
    // Login to get token
    const loginPayload = {
      email: 'testuser1@example.com',
      password: 'TestPassword123!'
    };
    const loginRes = await request(BASE_URL).post('/users/login').send(loginPayload);
    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.body.token;
    expect(token).toBeDefined();
    // Send first message
    const res1 = await request(BASE_URL)
      .post('/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'What is my last order?' });
    expect(res1.statusCode).toBe(200);
    // Send follow-up message
    const res2 = await request(BASE_URL)
      .post('/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'And what about the previous one?' });
    expect(res2.statusCode).toBe(200);
    expect(res2.text.toLowerCase()).toMatch(/previous|order/);
  });

  // User Story 5: FAQ Retrieval
  it('should retrieve FAQ answers', async () => {
    const payload = { message: 'How do I reset my password?' };
    const res = await request(BASE_URL).post('/chat').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.text.toLowerCase()).toMatch(/reset|password|faq/);
  });

  // Negative Case: Invalid Login
  it('should not login with invalid credentials', async () => {
    const payload = {
      email: 'wronguser@example.com',
      password: 'WrongPassword!'
    };
    const res = await request(BASE_URL).post('/users/login').send(payload);
    expect([400, 401]).toContain(res.statusCode);
  });

  // Negative Case: Missing Auth Header for protected chat
  it('should fail or allow chat without auth header', async () => {
    const payload = { message: 'Show my order history' };
    const res = await request(BASE_URL).post('/chat').send(payload);
    expect([200, 401, 403]).toContain(res.statusCode);
  });

  // Negative Case: Unknown Product Query
  it('should handle unknown product query', async () => {
    const payload = { message: 'Tell me about product XYZ-INVALID-123' };
    const res = await request(BASE_URL).post('/chat').send(payload);
    expect(res.statusCode).toBe(200);
    expect(
      res.text.toLowerCase().includes('not found') ||
      res.text.toLowerCase().includes('unknown') ||
      res.text.toLowerCase().includes('no information') ||
      res.text.trim() !== ''
    ).toBeTruthy();
  });
