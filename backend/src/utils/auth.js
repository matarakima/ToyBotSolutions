// JWT authentication middleware
const jwt = require('jsonwebtoken');

function authenticate(request, reply, done) {
  const authHeader = request.headers['authorization'];
  if (!authHeader) {
    reply.code(401).send({ error: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      reply.code(401).send({ error: 'Invalid token' });
      return;
    }
    request.user = decoded.user;
    done();
  });
}

// Este archivo queda obsoleto, el middleware fue movido a src/middleware/authMiddleware.js
module.exports = {};
