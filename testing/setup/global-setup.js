/**
 * Configuración global para todas las pruebas
 * Compatible con Jest y Playwright
 */

// Cargar variables de entorno
require('dotenv').config();

// Configurar entorno de pruebas
process.env.NODE_ENV = 'test';

// Configurar variables por defecto para testing
process.env.PORT = process.env.PORT || '3001';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
process.env.DB_PATH = process.env.DB_PATH || './test-database.sqlite';
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-key';

// Configurar timeouts globales (solo para Jest)
if (typeof jest !== 'undefined') {
  jest.setTimeout(10000);
}

// Configurar console para pruebas
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Opcional: silenciar logs durante pruebas
if (process.env.SILENCE_LOGS === 'true') {
  console.log = () => {};
  console.error = () => {};
}

// Restaurar console después de las pruebas
const restoreConsole = () => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
};

// Mocks globales para Jest
if (typeof jest !== 'undefined') {
  // Mock de OpenAI para pruebas
  global.mockOpenAI = {
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  };

  // Helpers de prueba globales
  global.testHelpers = {
    // Crear token JWT de prueba
    createTestToken: (payload = { user: 'testuser' }) => {
      const jwt = require('jsonwebtoken');
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    },

    // Limpiar base de datos de prueba
    cleanTestDatabase: async () => {
      const fs = require('fs');
      const path = require('path');
      const dbPath = path.resolve(process.env.DB_PATH);
      
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
    },

    // Crear usuario de prueba
    createTestUser: async (username = 'testuser', password = 'testpass123') => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      return {
        username,
        password: hashedPassword
      };
    },

    // Generar datos de prueba
    generateTestData: (count = 5) => {
      const data = [];
      for (let i = 0; i < count; i++) {
        data.push({
          id: i + 1,
          username: `user${i + 1}`,
          email: `user${i + 1}@test.com`,
          createdAt: new Date().toISOString()
        });
      }
      return data;
    }
  };

  // Extender expect con matchers personalizados
  expect.extend({
    toBeValidResponse(received) {
      const pass = received && 
                   typeof received === 'object' && 
                   (received.success !== undefined || received.message !== undefined);
      
      return {
        message: () => `expected ${received} to be a valid API response`,
        pass
      };
    },

    toBeValidJWT(received) {
      const pass = typeof received === 'string' && 
                   received.split('.').length === 3;
      
      return {
        message: () => `expected ${received} to be a valid JWT token`,
        pass
      };
    }
  });

  // Hooks globales para Jest
  beforeAll(() => {
    console.log('🧪 Iniciando configuración global de pruebas...');
  });

  afterAll(() => {
    console.log('🧹 Finalizando configuración global de pruebas...');
    restoreConsole();
  });
}



// Exportar configuración para uso manual
module.exports = {
  restoreConsole,
  testHelpers: typeof global !== 'undefined' ? global.testHelpers : {},
  mockOpenAI: typeof global !== 'undefined' ? global.mockOpenAI : {}
}; 