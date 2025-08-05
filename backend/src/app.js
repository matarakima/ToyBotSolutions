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
