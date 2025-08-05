import { API_CONFIG, ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Realiza una petición HTTP con fetch
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} options - Opciones de la petición
   * @returns {Promise<any>} Respuesta de la API
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const requestConfig = {
        method: 'GET',
        headers: { ...defaultHeaders, ...options.headers },
        signal: controller.signal,
        ...options,
      };

      const response = await fetch(url, requestConfig);
      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw new ApiError(response.status, data.message || data.error || 'Request failed', data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ApiError(0, ERROR_MESSAGES.TIMEOUT);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(0, ERROR_MESSAGES.NETWORK);
    }
  }

  /**
   * Realiza una petición GET
   * @param {string} endpoint - Endpoint de la API
   * @param {string|null} token - Token de autenticación
   * @returns {Promise<any>} Respuesta de la API
   */
  async get(endpoint, token = null) {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.makeRequest(endpoint, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Realiza una petición POST
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @param {string|null} token - Token de autenticación
   * @returns {Promise<any>} Respuesta de la API
   */
  async post(endpoint, data, token = null) {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.makeRequest(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  // === MÉTODOS DE AUTENTICACIÓN ===

  /**
   * Inicia sesión con credenciales
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos del usuario y token
   */
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'Login failed', data);
    }
    
    return data;
  }

  /**
   * Registra un nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Confirmación del registro
   */
  async register(username, password) {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'Register failed', data);
    }
    
    return data;
  }

  // === MÉTODOS DE CHAT ===

  /**
   * Envía un mensaje al chat
   * @param {string} message - Mensaje a enviar
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} Respuesta del chat
   */
  async sendMessage(message, token) {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'Chat failed', data);
    }
    
    return data;
  }

  // === MÉTODOS DE ESTADÍSTICAS ===

  /**
   * Obtiene estadísticas del caché
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object>} Estadísticas del caché
   */
  async getCacheStats(token) {
    return this.get('/cache/stats', token);
  }
}

/**
 * Clase para manejar errores de la API
 */
class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  /**
   * Obtiene un mensaje de error legible para el usuario
   * @returns {string} Mensaje de error
   */
  getDisplayMessage() {
    switch (this.status) {
      case HTTP_STATUS.BAD_REQUEST:
        // Si hay un mensaje específico del servidor, usarlo
        if (this.message && this.message !== 'Request failed') {
          return this.message;
        }
        if (this.data && this.data.code === 'FST_ERR_VALIDATION') {
          return 'Error de validación: ' + (this.data.message || 'Datos inválidos');
        }
        return 'Datos inválidos. Por favor verifica la información ingresada.';
      case HTTP_STATUS.UNAUTHORIZED:
        // Si hay un mensaje específico del servidor, usarlo
        if (this.message && this.message !== 'Login failed') {
          return this.message;
        }
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.CONFLICT:
        // Si hay un mensaje específico del servidor, usarlo
        if (this.message && this.message !== 'Register failed') {
          return this.message;
        }
        return 'El usuario ya existe. Intenta con otro nombre de usuario.';
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return 'Demasiadas solicitudes. Espera un momento antes de intentar nuevamente.';
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        // Si hay un mensaje específico del servidor, usarlo
        if (this.message && this.message !== 'Request failed') {
          return this.message;
        }
        return ERROR_MESSAGES.SERVER;
      case 0:
        return this.message;
      default:
        return this.message || ERROR_MESSAGES.SERVER;
    }
  }
}

export { ApiService, ApiError };
export default new ApiService();
