// Chat route (protected)
const fp = require('fastify-plugin');
const { authenticate } = require('../middleware/authMiddleware');
const { getChatResponse } = require('../services/chatService');

module.exports = fp(async function (fastify, opts) {
  fastify.post('/chat', { preHandler: [authenticate] }, async (request, reply) => {
    const { message } = request.body;
    // RAG + GPT response
    const response = await getChatResponse(message);
    reply.send({ response });
  });
});
