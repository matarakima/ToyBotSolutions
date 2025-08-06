// Extraído para facilitar el mock en tests
const jwt = require('jsonwebtoken');
const { findUserByUsername } = require('../models/userModel');

async function authenticate(request, reply) {
  const authHeader = request.headers['authorization'];
  if (!authHeader) {
    reply.code(401).send({ 
      success: false,
      error: 'No token provided',
      action: 'login_required'
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // 🔐 VALIDACIÓN ADICIONAL: Verificar que el usuario existe en la BD actual
    const user = await findUserByUsername(decoded.user.username);
    
    if (!user) {
      // Usuario del JWT no existe en la base de datos actual
      reply.code(401).send({ 
        success: false,
        error: 'User session expired - database changed',
        action: 'relogin_required',
        message: 'Por favor inicia sesión nuevamente'
      });
      return;
    }
    
    // Usuario válido - continuar
    request.user = decoded.user;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      reply.code(401).send({ 
        success: false,
        error: 'Token expired',
        action: 'relogin_required',
        message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente'
      });
    } else {
      reply.code(401).send({ 
        success: false,
        error: 'Invalid token',
        action: 'relogin_required',
        message: 'Sesión inválida, por favor inicia sesión nuevamente'
      });
    }
    return;
  }
}

module.exports = { authenticate };
