/**
 * Configuración del servidor de pruebas
 * Crea una instancia de Fastify configurada para pruebas
 */

const fastify = require('fastify');
const cors = require('@fastify/cors');
const path = require('path');

class TestServer {
  constructor() {
    this.server = null;
    this.port = process.env.TEST_SERVER_PORT || 3001;
    this.host = process.env.TEST_SERVER_HOST || 'localhost';
  }

  /**
   * Crear y configurar servidor de pruebas
   */
  async createServer() {
    try {
      // Crear instancia de Fastify con configuración mínima para pruebas
      this.server = fastify({
        logger: {
          level: process.env.LOG_LEVEL || 'error',
          prettyPrint: false
        }
      });

      // Registrar CORS
      await this.server.register(cors, {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
      });

      // Registrar rutas de autenticación
      const authRoutes = require('../../backend/src/routes/auth');
      await this.server.register(authRoutes);

      // Registrar rutas de chat
      const chatRoutes = require('../../backend/src/routes/chat');
      await this.server.register(chatRoutes);

      // Ruta de health check para pruebas
      this.server.get('/health', async (request, reply) => {
        return { status: 'ok', timestamp: new Date().toISOString() };
      });

      // Ruta de prueba para verificar configuración
      this.server.get('/test-config', async (request, reply) => {
        return {
          environment: process.env.NODE_ENV,
          port: this.port,
          host: this.host,
          database: process.env.DB_PATH
        };
      });

      console.log('✅ Servidor de pruebas creado correctamente');
      return this.server;
    } catch (error) {
      console.error('❌ Error al crear servidor de pruebas:', error);
      throw error;
    }
  }

  /**
   * Iniciar servidor de pruebas
   */
  async start() {
    try {
      if (!this.server) {
        await this.createServer();
      }

      await this.server.listen({
        port: this.port,
        host: this.host
      });

      console.log(`🚀 Servidor de pruebas iniciado en http://${this.host}:${this.port}`);
      return this.server;
    } catch (error) {
      console.error('❌ Error al iniciar servidor de pruebas:', error);
      throw error;
    }
  }

  /**
   * Detener servidor de pruebas
   */
  async stop() {
    try {
      if (this.server) {
        await this.server.close();
        this.server = null;
        console.log('🛑 Servidor de pruebas detenido');
      }
    } catch (error) {
      console.error('❌ Error al detener servidor de pruebas:', error);
      throw error;
    }
  }

  /**
   * Obtener URL del servidor
   */
  getUrl() {
    return `http://${this.host}:${this.port}`;
  }

  /**
   * Verificar si el servidor está ejecutándose
   */
  async isRunning() {
    try {
      if (!this.server) return false;
      
      const response = await this.server.inject({
        method: 'GET',
        url: '/health'
      });
      
      return response.statusCode === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Reiniciar servidor
   */
  async restart() {
    try {
      await this.stop();
      await this.start();
      console.log('🔄 Servidor de pruebas reiniciado');
    } catch (error) {
      console.error('❌ Error al reiniciar servidor de pruebas:', error);
      throw error;
    }
  }

  /**
   * Crear servidor con configuración personalizada
   */
  async createCustomServer(config = {}) {
    try {
      const customServer = fastify({
        logger: config.logger || false,
        ...config
      });

      // Registrar CORS si se especifica
      if (config.cors !== false) {
        await customServer.register(cors, {
          origin: config.corsOrigin || process.env.CORS_ORIGIN || 'http://localhost:5173',
          methods: config.corsMethods || ['GET', 'POST', 'PUT', 'DELETE'],
          credentials: true
        });
      }

      // Registrar rutas si se especifican
      if (config.routes) {
        for (const route of config.routes) {
          await customServer.register(route);
        }
      }

      return customServer;
    } catch (error) {
      console.error('❌ Error al crear servidor personalizado:', error);
      throw error;
    }
  }
}

// Función helper para crear servidor de pruebas
async function createTestServer(config = {}) {
  const testServer = new TestServer();
  
  if (config.custom) {
    return await testServer.createCustomServer(config);
  } else {
    return await testServer.createServer();
  }
}

// Función helper para iniciar servidor de pruebas
async function startTestServer(config = {}) {
  const testServer = new TestServer();
  return await testServer.start();
}

// Exportar clase y funciones helper
module.exports = {
  TestServer,
  createTestServer,
  startTestServer
}; 