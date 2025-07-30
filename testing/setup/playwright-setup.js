/**
 * Configuración global para pruebas E2E con Playwright
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

// Función de configuración global para Playwright
async function globalSetup() {
  console.log('🎭 Iniciando configuración global de pruebas E2E...');
  
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

  // Configurar cleanup
  process.on('exit', () => {
    console.log('🧹 Finalizando configuración global de pruebas E2E...');
    restoreConsole();
  });

  console.log('✅ Configuración global de Playwright completada');
}

module.exports = globalSetup; 