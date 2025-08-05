// Servicio de historial de conversación
// Almacena el historial de chat por usuario en memoria con TTL

class ConversationHistoryService {
  constructor() {
    this.conversations = new Map(); // user -> { messages: [], lastActivity: timestamp }
    this.MAX_MESSAGES = 20; // Máximo de mensajes por conversación
    this.TTL = 30 * 60 * 1000; // 30 minutos TTL
    
    // Limpieza automática cada 10 minutos
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  /**
   * Obtener historial de conversación de un usuario
   * @param {string} username - Nombre del usuario
   * @returns {Array} Array de mensajes del historial
   */
  getHistory(username) {
    const conversation = this.conversations.get(username);
    if (!conversation) {
      return [];
    }

    // Verificar TTL
    if (Date.now() - conversation.lastActivity > this.TTL) {
      this.conversations.delete(username);
      return [];
    }

    return conversation.messages || [];
  }

  /**
   * Agregar mensaje al historial
   * @param {string} username - Nombre del usuario
   * @param {string} role - 'user' o 'assistant'
   * @param {string} content - Contenido del mensaje
   */
  addMessage(username, role, content) {
    let conversation = this.conversations.get(username);
    
    if (!conversation) {
      conversation = {
        messages: [],
        lastActivity: Date.now()
      };
      this.conversations.set(username, conversation);
    }

    // Agregar nuevo mensaje
    conversation.messages.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });

    // Mantener solo los últimos MAX_MESSAGES mensajes
    if (conversation.messages.length > this.MAX_MESSAGES) {
      conversation.messages = conversation.messages.slice(-this.MAX_MESSAGES);
    }

    // Actualizar timestamp de actividad
    conversation.lastActivity = Date.now();
  }

  /**
   * Limpiar conversación de un usuario
   * @param {string} username - Nombre del usuario
   */
  clearConversation(username) {
    this.conversations.delete(username);
  }

  /**
   * Obtener mensajes formateados para el LLM (solo role y content)
   * @param {string} username - Nombre del usuario
   * @returns {Array} Array de mensajes formato OpenAI
   */
  getFormattedHistory(username) {
    const history = this.getHistory(username);
    return history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  /**
   * Limpiar conversaciones expiradas
   */
  cleanup() {
    const now = Date.now();
    for (const [username, conversation] of this.conversations.entries()) {
      if (now - conversation.lastActivity > this.TTL) {
        this.conversations.delete(username);
      }
    }
  }

  /**
   * Obtener estadísticas del servicio
   * @returns {Object} Estadísticas
   */
  getStats() {
    return {
      activeConversations: this.conversations.size,
      totalMessages: Array.from(this.conversations.values())
        .reduce((total, conv) => total + conv.messages.length, 0),
      maxMessages: this.MAX_MESSAGES,
      ttlMinutes: this.TTL / (60 * 1000)
    };
  }
}

// Singleton instance
const conversationHistory = new ConversationHistoryService();

module.exports = {
  conversationHistory,
  ConversationHistoryService
};
