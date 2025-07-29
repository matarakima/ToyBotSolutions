// Chat route (protected)
const fp = require('fastify-plugin');
const { authenticate } = require('../middleware/authMiddleware');
const { getChatResponse } = require('../services/chatService');

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
});
