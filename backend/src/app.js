require('dotenv').config();
// Fastify app setup
const fastify = require('fastify')({ logger: true });
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const fastifyCors = require('@fastify/cors');

// Fastify ya soporta JSON en el body por defecto en v4.x

// Register routes
fastify.register(authRoutes);
fastify.register(chatRoutes);

// Start server
const start = async () => {
  try {
    // Register CORS
    await fastify.register(fastifyCors, {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Usa una variable de entorno para definir el origen permitido
      methods: ['GET', 'POST'], // Métodos permitidos
    });

    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    fastify.log.info(`Server running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
