const fp = require('fastify-plugin');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hash');
const { createUser, findUserByUsername } = require('../models/userModel');

// === ESQUEMAS DE VALIDACIÓN ===

const registerSchema = {
  body: {
    type: 'object',
    properties: {
      username: { 
        type: 'string',
        minLength: 3,
        maxLength: 30,
        pattern: '^[a-zA-Z0-9_]+$'
      },
      password: { 
        type: 'string',
        minLength: 4,
        maxLength: 100
      }
    },
    required: ['username', 'password'],
    additionalProperties: false
  }
};

const loginSchema = {
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['username', 'password'],
    additionalProperties: false
  }
};

// === PLUGIN DE RUTAS ===

async function authRoutes(fastify, options) {
  
  /**
   * Registro de nuevo usuario
   */
  fastify.post('/register', { schema: registerSchema }, async (request, reply) => {
    const { username, password } = request.body;
    
    try {
      // Verificar si el usuario ya existe
      const existing = await findUserByUsername(username);
      if (existing) {
        return reply.code(409).send({ 
          success: false, 
          message: 'Este nombre de usuario ya está en uso. Por favor elige otro.',
          errorType: 'business',
          field: null
        });
      }
      
      // Crear nuevo usuario
      const passwordHash = await hashPassword(password);
      await createUser(username, passwordHash);
      
      reply.send({ 
        success: true, 
        message: 'Usuario registrado exitosamente' 
      });
      
    } catch (error) {
      fastify.log.error('Registration error:', error);
      reply.code(500).send({ 
        success: false, 
        message: 'Error interno del servidor. Por favor intenta nuevamente.' 
      });
    }
  });

  /**
   * Inicio de sesión
   */
  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { username, password } = request.body;
    
    try {
      // Buscar usuario
      const user = await findUserByUsername(username);
      if (!user) {
        return reply.code(401).send({ 
          success: false, 
          message: 'Nombre de usuario o contraseña incorrectos',
          errorType: 'business',
          field: null
        });
      }
      
      // Verificar contraseña
      const valid = await comparePassword(password, user.password);
      if (!valid) {
        return reply.code(401).send({ 
          success: false, 
          message: 'Nombre de usuario o contraseña incorrectos',
          errorType: 'business',
          field: null
        });
      }
      
      // Generar token JWT
      const token = jwt.sign(
        { user: username }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );
      
      reply.send({ 
        success: true, 
        token, 
        message: 'Inicio de sesión exitoso' 
      });
      
    } catch (error) {
      fastify.log.error('Login error:', error);
      reply.code(500).send({ 
        success: false, 
        message: 'Error interno del servidor. Por favor intenta nuevamente.' 
      });
    }
  });
}

// Exportar como plugin de Fastify
module.exports = fp(authRoutes);
