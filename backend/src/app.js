require('dotenv').config();
// Fastify app setup
const fastify = require('fastify')({ logger: true });
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

// Fastify ya soporta JSON en el body por defecto en v4.x

// Register routes
fastify.register(authRoutes);
fastify.register(chatRoutes);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    fastify.log.info(`Server running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
