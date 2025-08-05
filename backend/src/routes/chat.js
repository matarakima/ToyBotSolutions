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
});
