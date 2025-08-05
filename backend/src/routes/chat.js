// Chat route (protected) con Historial de Conversación
const fp = require('fastify-plugin');
const { authenticate } = require('../middleware/authMiddleware');
const { getChatResponse, clearConversation, getConversationHistory, getConversationStats } = require('../services/chatService');
const { getCacheStats } = require('../services/ragService');

module.exports = fp(async function (fastify, opts) {
  // Schema simplificado compatible con Fastify v5
  const chatSchema = {
    body: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      required: ['message'],
      additionalProperties: false
    }
  };

  // Rate limiting simple en memoria
  const userRequests = new Map();
  const RATE_LIMIT = 10; // 10 requests por minuto
  const RATE_WINDOW = 60 * 1000; // 1 minuto

  const checkRateLimit = (username) => {
    const now = Date.now();
    const userKey = username;
    
    if (!userRequests.has(userKey)) {
      userRequests.set(userKey, { count: 1, resetTime: now + RATE_WINDOW });
      return true;
    }
    
    const userData = userRequests.get(userKey);
    
    if (now > userData.resetTime) {
      userRequests.set(userKey, { count: 1, resetTime: now + RATE_WINDOW });
      return true;
    }
    
    if (userData.count >= RATE_LIMIT) {
      return false;
    }
    
    userData.count++;
    return true;
  };

  fastify.post('/chat', { 
    schema: chatSchema, 
    preHandler: [authenticate] 
  }, async (request, reply) => {
    const { message } = request.body;
    const username = request.user?.user;

    // Rate limiting
    if (!checkRateLimit(username)) {
      return reply.code(429).send({ 
        status: 'error', 
        message: 'Too many requests. Please wait a moment before sending another message.' 
      });
    }

    try {
      // Sanitizar mensaje
      const sanitizedMessage = message.trim().substring(0, 1000);
      
      // RAG + GPT response con historial
      const response = await getChatResponse(sanitizedMessage, username);
      reply.send({ status: 'completed', response, timestamp: new Date().toISOString() });
    } catch (error) {
      fastify.log.error('Chat error:', error);
      reply.code(500).send({ 
        status: 'error', 
        message: 'An error occurred while processing your request. Please try again.' 
      });
    }
  });

  // 📊 Endpoint opcional para estadísticas del cache (solo para PoC/debugging)
  fastify.get('/cache/stats', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const cacheStats = getCacheStats();
      const conversationStats = getConversationStats();
      reply.send({ 
        status: 'success', 
        cache: cacheStats,
        conversations: conversationStats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      reply.code(500).send({ status: 'error', message: 'Error getting cache stats.' });
    }
  });

  // 📜 Endpoint para obtener historial de conversación
  fastify.get('/conversation/history', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const username = request.user?.user;
      const history = getConversationHistory(username);
      reply.send({
        status: 'success',
        history,
        username,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      reply.code(500).send({ status: 'error', message: 'Error getting conversation history.' });
    }
  });

  // 🧹 Endpoint para limpiar historial de conversación
  fastify.delete('/conversation/clear', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const username = request.user?.user;
      clearConversation(username);
      reply.send({
        status: 'success',
        message: 'Conversation history cleared.',
        username,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      reply.code(500).send({ status: 'error', message: 'Error clearing conversation history.' });
    }
  });

  // 🧹 Endpoint para limpiar cache manualmente (útil para testing)
  fastify.delete('/cache/clear', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const { clearEmbeddings, clearSearches, clearResponses } = require('../services/ragService');
      
      // Por ahora, simplemente reiniciamos el servidor para limpiar el cache
      // En producción, implementaríamos funciones específicas de limpieza
      reply.send({ 
        status: 'success', 
        message: 'Cache será limpiado automáticamente por TTL',
        note: 'Para limpiar inmediatamente, reinicia el servidor'
      });
    } catch (error) {
      reply.code(500).send({ status: 'error', message: 'Error clearing cache.' });
    }
  });
});
