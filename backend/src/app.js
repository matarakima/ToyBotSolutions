require('dotenv').config();

// Fastify v5 - configuración que funciona
const fastify = require('fastify')({
  logger: true,
  ajv: {
    customOptions: {
      strict: false,
      removeAdditional: false
    }
  }
});

const start = async () => {
  try {
    // Registrar CORS primero - versión simple para Fastify v5
    await fastify.register(require('@fastify/cors'), {
      origin: true,
      credentials: true
    });

    // Manejador global de errores de validación
    fastify.setErrorHandler(async (error, request, reply) => {
      // Manejar errores de validación de esquemas
      if (error.validation) {
        const errorDetails = error.validation[0];
        const field = errorDetails.instancePath?.replace('/body/', '').replace('/', '') || errorDetails.params?.missingProperty;
        
        let userMessage = 'Por favor verifica que todos los campos estén completos y sean válidos';
        let errorType = 'validation';
        let fieldName = field;
        
        // Mensajes específicos por campo y error
        if (field === 'username') {
          if (errorDetails.keyword === 'minLength') {
            userMessage = 'El nombre de usuario debe tener al menos 3 caracteres';
          } else if (errorDetails.keyword === 'maxLength') {
            userMessage = 'El nombre de usuario no puede tener más de 30 caracteres';
          } else if (errorDetails.keyword === 'pattern') {
            userMessage = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
          } else if (errorDetails.keyword === 'required') {
            userMessage = 'El nombre de usuario es obligatorio';
          }
        } else if (field === 'password') {
          if (errorDetails.keyword === 'minLength') {
            userMessage = 'La contraseña debe tener al menos 4 caracteres';
          } else if (errorDetails.keyword === 'maxLength') {
            userMessage = 'La contraseña no puede tener más de 100 caracteres';
          } else if (errorDetails.keyword === 'required') {
            userMessage = 'La contraseña es obligatoria';
          }
        }
        
        return reply.code(400).send({
          success: false,
          message: userMessage,
          errorType: errorType,
          field: fieldName
        });
      }
      
      // Para otros errores, usar el manejador predeterminado
      reply.send(error);
    });

    // Health Check Endpoint
    fastify.get('/health', async (request, reply) => {
      const startTime = Date.now();
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {},
        checks: {}
      };

      try {
        // Check básico del servidor
        health.checks.server = {
          status: 'healthy',
          message: 'Server is running'
        };

        // Check de memoria - información limitada en producción
        const memoryUsage = process.memoryUsage();
        const isProduction = process.env.NODE_ENV === 'production';
        
        health.checks.memory = {
          status: memoryUsage.heapUsed < 1024 * 1024 * 1024 ? 'healthy' : 'warning', // 1GB
          ...(isProduction ? {} : {
            usage: {
              heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
              heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
              external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
            }
          })
        };

        // Check de servicios disponibles
        try {
          const { getCacheStats } = require('./services/ragService');
          const isProduction = process.env.NODE_ENV === 'production';
          const cacheStats = getCacheStats();
          
          health.services.rag = {
            status: 'healthy',
            ...(isProduction ? {} : { cache: cacheStats })
          };
        } catch (error) {
          health.services.rag = {
            status: 'error',
            message: isProduction ? 'Service unavailable' : error.message
          };
        }

        try {
          const { getConversationStats } = require('./services/chatService');
          const isProduction = process.env.NODE_ENV === 'production';
          const chatStats = getConversationStats();
          
          health.services.chat = {
            status: 'healthy',
            ...(isProduction ? {} : { stats: chatStats })
          };
        } catch (error) {
          health.services.chat = {
            status: 'error',
            message: isProduction ? 'Service unavailable' : error.message
          };
        }

        // Verificar acceso a base de datos
        try {
          const knex = require('./db');
          const isProduction = process.env.NODE_ENV === 'production';
          
          // Test simple de conectividad
          await knex.raw('SELECT 1 as test');
          
          health.checks.database = {
            status: 'healthy',
            message: 'Database accessible',
            ...(isProduction ? {} : {
              type: process.env.NODE_ENV === 'production' ? 'Azure SQL' : 'SQLite',
              connectionTest: 'passed'
            })
          };
        } catch (error) {
          health.checks.database = {
            status: 'error',
            message: isProduction ? 'Database connection failed' : error.message
          };
        }

        // Tiempo de respuesta
        const responseTime = Date.now() - startTime;
        health.responseTime = `${responseTime}ms`;

        // Determinar estado general
        const hasErrors = Object.values(health.checks).some(check => check.status === 'error') ||
                         Object.values(health.services).some(service => service.status === 'error');
        
        const hasWarnings = Object.values(health.checks).some(check => check.status === 'warning') ||
                           Object.values(health.services).some(service => service.status === 'warning');

        if (hasErrors) {
          health.status = 'unhealthy';
          return reply.code(503).send(health);
        } else if (hasWarnings) {
          health.status = 'degraded';
          return reply.code(200).send(health);
        }

        return reply.code(200).send(health);

      } catch (error) {
        health.status = 'unhealthy';
        health.error = error.message;
        return reply.code(503).send(health);
      }
    });

    // Health Check simple para load balancers
    fastify.get('/health/live', async (request, reply) => {
      return reply.code(200).send({ 
        status: 'alive',
        timestamp: new Date().toISOString()
      });
    });

    // Readiness check - verificar si el servidor está listo para recibir tráfico
    fastify.get('/health/ready', async (request, reply) => {
      try {
        // Verificaciones básicas de que los servicios están listos
        const { getCacheStats } = require('./services/ragService');
        const { getConversationStats } = require('./services/chatService');
        
        // Intentar acceder a los servicios básicos
        getCacheStats();
        getConversationStats();
        
        return reply.code(200).send({ 
          status: 'ready',
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        });
      } catch (error) {
        return reply.code(503).send({ 
          status: 'not ready',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Fastify v5 ya incluye el parser JSON por defecto
    // Eliminar el parser custom que estaba causando conflictos

    // Registrar rutas
    await fastify.register(require('./routes/auth'));
    await fastify.register(require('./routes/chat'));

    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

start();
