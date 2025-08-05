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
