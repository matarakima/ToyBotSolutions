/**
 * Mock para OpenAI API
 * Proporciona respuestas simuladas para las pruebas
 */

class MockOpenAI {
  constructor() {
    this.chat = {
      completions: {
        create: jest.fn()
      }
    };
  }

  /**
   * Configurar respuesta exitosa
   */
  setSuccessResponse(content = 'Respuesta de prueba') {
    this.chat.completions.create.mockResolvedValue({
      choices: [
        {
          message: {
            content: content
          }
        }
      ]
    });
  }

  /**
   * Configurar respuesta de error
   */
  setErrorResponse(errorMessage = 'Error de API') {
    this.chat.completions.create.mockRejectedValue(
      new Error(errorMessage)
    );
  }

  /**
   * Configurar respuesta vacía
   */
  setEmptyResponse() {
    this.chat.completions.create.mockResolvedValue({
      choices: [
        {
          message: {
            content: ''
          }
        }
      ]
    });
  }

  /**
   * Configurar respuesta sin choices
   */
  setNoChoicesResponse() {
    this.chat.completions.create.mockResolvedValue({
      choices: []
    });
  }

  /**
   * Configurar respuesta con estructura inesperada
   */
  setUnexpectedResponse() {
    this.chat.completions.create.mockResolvedValue({
      choices: [
        {
          message: null
        }
      ]
    });
  }

  /**
   * Configurar timeout
   */
  setTimeoutResponse(timeoutMs = 100) {
    this.chat.completions.create.mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      )
    );
  }

  /**
   * Configurar respuesta específica para diferentes mensajes
   */
  setResponsiveResponse(responses = {}) {
    this.chat.completions.create.mockImplementation((params) => {
      const userMessage = params.messages.find(m => m.role === 'user')?.content || '';
      
      // Buscar respuesta específica o usar default
      const response = responses[userMessage] || responses.default || 'Respuesta por defecto';
      
      return Promise.resolve({
        choices: [
          {
            message: {
              content: response
            }
          }
        ]
      });
    });
  }

  /**
   * Configurar respuesta que simula conversación
   */
  setConversationResponse() {
    let messageCount = 0;
    
    this.chat.completions.create.mockImplementation(() => {
      messageCount++;
      return Promise.resolve({
        choices: [
          {
            message: {
              content: `Respuesta ${messageCount} de la conversación`
            }
          }
        ]
      });
    });
  }

  /**
   * Configurar respuesta que simula diferentes tipos de errores
   */
  setErrorTypes() {
    this.chat.completions.create.mockImplementation(() => {
      const errorTypes = [
        new Error('Network Error'),
        new Error('Authentication Error'),
        new Error('Rate limit exceeded'),
        new Error('Invalid API key'),
        new Error('Server error')
      ];
      
      const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      return Promise.reject(randomError);
    });
  }

  /**
   * Limpiar mock
   */
  clear() {
    this.chat.completions.create.mockClear();
  }

  /**
   * Obtener llamadas realizadas
   */
  getCalls() {
    return this.chat.completions.create.mock.calls;
  }

  /**
   * Verificar si fue llamado
   */
  wasCalled() {
    return this.chat.completions.create.mock.calls.length > 0;
  }

  /**
   * Obtener número de llamadas
   */
  getCallCount() {
    return this.chat.completions.create.mock.calls.length;
  }

  /**
   * Obtener parámetros de la última llamada
   */
  getLastCallParams() {
    const calls = this.chat.completions.create.mock.calls;
    return calls.length > 0 ? calls[calls.length - 1][0] : null;
  }
}

// Crear instancia singleton
const mockOpenAI = new MockOpenAI();

// Configurar mock por defecto
mockOpenAI.setSuccessResponse();

// Exportar instancia y clase
module.exports = {
  mockOpenAI,
  MockOpenAI
}; 