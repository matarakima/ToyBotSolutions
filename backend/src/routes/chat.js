// Chat route (protected)
const fp = require('fastify-plugin');
const { authenticate } = require('../middleware/authMiddleware');
const { getChatResponse } = require('../services/chatService');
const { getCacheStats } = require('../services/ragService');

module.exports = fp(async function (fastify, opts) {
  fastify.post('/chat', { preHandler: [authenticate] }, async (request, reply) => {
    const { message } = request.body;

    try {
      // RAG + GPT response
      const response = await getChatResponse(message);
      reply.send({ status: 'completed', response });
    } catch (error) {
      // Handle errors gracefully
      reply.code(500).send({ status: 'error', message: 'An error occurred while processing the request.' });
    }
  });

  // 📊 Endpoint opcional para estadísticas del cache (solo para PoC/debugging)
  fastify.get('/cache/stats', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const stats = getCacheStats();
      reply.send({ 
        status: 'success', 
        cache: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      reply.code(500).send({ status: 'error', message: 'Error getting cache stats.' });
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
