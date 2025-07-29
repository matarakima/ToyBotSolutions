// RAG service: fetch context for chat
async function getRagContext(query) {
  // TODO: Implement retrieval from DB or documents
  // For now, return dummy context
  return 'Información relevante recuperada para el usuario.';
}

module.exports = { getRagContext };
