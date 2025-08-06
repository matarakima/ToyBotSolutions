import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService, { ApiError } from '../services/apiService';
import { validateMessage, sanitizeInput } from '../utils/validation';
import '../styles/Chat.css';
import MarkdownMessage from './MarkdownMessage';

const Chat = () => {
  const [messages, setMessages] = useState([
    { 
      text: "¡Hola! 👋 Soy ToyBot, tu asistente inteligente. ¿En qué puedo ayudarte hoy?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { token, logout, user, handleAuthError } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || isProcessing) return;

    // Validación básica
    const sanitizedMessage = sanitizeInput(message);
    const messageErrors = validateMessage(sanitizedMessage);
    
    if (messageErrors.length > 0) {
      setMessages((prev) => [...prev, { 
        text: `❌ ${messageErrors[0]}`, 
        sender: 'bot',
        timestamp: new Date()
      }]);
      return;
    }

    // Agregar mensaje del usuario
    const userMessage = { 
      text: sanitizedMessage, 
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setInputValue('');

    try {
      const data = await apiService.sendMessage(sanitizedMessage, token);
      
      if (data.status === 'completed') {
        const botMessage = { 
          text: data.response, 
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(data.message || 'Error del servidor');
      }
    } catch (error) {
      let errorMessage = 'Ha ocurrido un error inesperado.';
      
      if (error instanceof ApiError) {
        errorMessage = error.getDisplayMessage();
        
        // 🆕 NUEVO: Usar handleAuthError para logout automático
        const wasLoggedOut = handleAuthError(error);
        if (wasLoggedOut) {
          // Si se hizo logout automático, mostrar mensaje informativo
          setMessages((prev) => [...prev, { 
            text: `🔐 ${errorMessage}. Serás redirigido al login...`, 
            sender: 'bot',
            timestamp: new Date()
          }]);
          // Pequeño delay para que el usuario vea el mensaje
          setTimeout(() => {
            // El App.jsx se encargará de la redirección automática
          }, 1500);
          return;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessages((prev) => [...prev, { 
        text: `❌ ${errorMessage}`, 
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  }, [token, logout, isProcessing]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="chat-container">
      {/* Header del chat */}
      <div className="chat-header">
        <div className="bot-info">
          <div className="bot-avatar">🤖</div>
          <div className="bot-details">
            <h3>ToyBot</h3>
            <span className="bot-status">En línea</span>
          </div>
        </div>
        <div className="user-info">
          <span className="welcome">Hola, {user?.username || user || 'Usuario'}</span>
          <button onClick={logout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Mensajes */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">
              <MarkdownMessage text={msg.text} className="markdown-message" />
              <div className="message-time">
                {msg.timestamp?.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicador de escritura */}
        {isProcessing && (
          <div className="message bot typing">
            <div className="message-content">
              <div className="typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-text">ToyBot está escribiendo...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input del chat */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu mensaje..."
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="chat-input"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isProcessing}
            className="send-button"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
