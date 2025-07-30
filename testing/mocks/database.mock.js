/**
 * Mock para base de datos
 * Proporciona funciones simuladas para las pruebas
 */

class MockDatabase {
  constructor() {
    this.users = new Map();
    this.chatHistory = new Map();
    this.nextUserId = 1;
  }

  /**
   * Mock para crear usuario
   */
  async createUser(username, passwordHash) {
    if (this.users.has(username)) {
      throw new Error('User already exists');
    }

    const user = {
      id: this.nextUserId++,
      username,
      password: passwordHash,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.users.set(username, user);
    return user;
  }

  /**
   * Mock para buscar usuario por username
   */
  async findUserByUsername(username) {
    return this.users.get(username) || null;
  }

  /**
   * Mock para buscar usuario por ID
   */
  async findUserById(id) {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  /**
   * Mock para actualizar usuario
   */
  async updateUser(username, updates) {
    const user = this.users.get(username);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updates, { updated_at: new Date() });
    return user;
  }

  /**
   * Mock para eliminar usuario
   */
  async deleteUser(username) {
    const deleted = this.users.delete(username);
    if (!deleted) {
      throw new Error('User not found');
    }
    return true;
  }

  /**
   * Mock para listar usuarios
   */
  async listUsers(limit = 10, offset = 0) {
    const userArray = Array.from(this.users.values());
    return userArray.slice(offset, offset + limit);
  }

  /**
   * Mock para guardar mensaje de chat
   */
  async saveChatMessage(userId, message, response) {
    const chatMessage = {
      id: Date.now(),
      user_id: userId,
      message,
      response,
      created_at: new Date()
    };

    if (!this.chatHistory.has(userId)) {
      this.chatHistory.set(userId, []);
    }

    this.chatHistory.get(userId).push(chatMessage);
    return chatMessage;
  }

  /**
   * Mock para obtener historial de chat
   */
  async getChatHistory(userId, limit = 50) {
    const history = this.chatHistory.get(userId) || [];
    return history.slice(-limit);
  }

  /**
   * Mock para limpiar historial de chat
   */
  async clearChatHistory(userId) {
    this.chatHistory.delete(userId);
    return true;
  }

  /**
   * Mock para verificar conexión
   */
  async testConnection() {
    return true;
  }

  /**
   * Mock para obtener estadísticas
   */
  async getStats() {
    return {
      totalUsers: this.users.size,
      totalMessages: Array.from(this.chatHistory.values()).reduce((sum, messages) => sum + messages.length, 0),
      activeUsers: this.users.size
    };
  }

  /**
   * Mock para backup de datos
   */
  async backup() {
    return {
      users: Array.from(this.users.entries()),
      chatHistory: Array.from(this.chatHistory.entries()),
      timestamp: new Date()
    };
  }

  /**
   * Mock para restaurar datos
   */
  async restore(backupData) {
    this.users.clear();
    this.chatHistory.clear();

    // Restaurar usuarios
    for (const [username, user] of backupData.users) {
      this.users.set(username, user);
    }

    // Restaurar historial de chat
    for (const [userId, messages] of backupData.chatHistory) {
      this.chatHistory.set(userId, messages);
    }

    return true;
  }

  /**
   * Mock para transacciones
   */
  async transaction(callback) {
    // Simular transacción
    const backup = await this.backup();
    
    try {
      const result = await callback(this);
      return result;
    } catch (error) {
      // Rollback en caso de error
      await this.restore(backup);
      throw error;
    }
  }

  /**
   * Mock para consultas complejas
   */
  async query(sql, params = []) {
    // Simular consulta SQL básica
    if (sql.toLowerCase().includes('select')) {
      if (sql.toLowerCase().includes('users')) {
        return Array.from(this.users.values());
      }
      if (sql.toLowerCase().includes('chat')) {
        return Array.from(this.chatHistory.values()).flat();
      }
    }
    
    if (sql.toLowerCase().includes('insert')) {
      return { insertId: Date.now() };
    }
    
    if (sql.toLowerCase().includes('update')) {
      return { affectedRows: 1 };
    }
    
    if (sql.toLowerCase().includes('delete')) {
      return { affectedRows: 1 };
    }
    
    return [];
  }

  /**
   * Mock para migraciones
   */
  async migrate() {
    return {
      success: true,
      migrations: ['create_users_table', 'create_chat_history_table'],
      timestamp: new Date()
    };
  }

  /**
   * Mock para seeders
   */
  async seed() {
    // Crear algunos usuarios de prueba
    await this.createUser('admin', 'hashed_admin_password');
    await this.createUser('testuser', 'hashed_test_password');
    
    return {
      success: true,
      seededUsers: 2,
      timestamp: new Date()
    };
  }

  /**
   * Limpiar todos los datos
   */
  clear() {
    this.users.clear();
    this.chatHistory.clear();
    this.nextUserId = 1;
  }

  /**
   * Obtener estado actual
   */
  getState() {
    return {
      users: Array.from(this.users.entries()),
      chatHistory: Array.from(this.chatHistory.entries()),
      nextUserId: this.nextUserId
    };
  }

  /**
   * Restaurar estado
   */
  setState(state) {
    this.users.clear();
    this.chatHistory.clear();
    
    for (const [username, user] of state.users) {
      this.users.set(username, user);
    }
    
    for (const [userId, messages] of state.chatHistory) {
      this.chatHistory.set(userId, messages);
    }
    
    this.nextUserId = state.nextUserId;
  }
}

// Crear instancia singleton
const mockDatabase = new MockDatabase();

// Exportar instancia y clase
module.exports = {
  mockDatabase,
  MockDatabase
}; 