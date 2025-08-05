import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService, { ApiError } from '../services/apiService';
import { validateMessage, sanitizeInput } from '../utils/validation';
import '../styles/Chat.css';
import MarkdownMessage from './MarkdownMessage';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { token, logout } = useAuth();

  const sendMessage = useCallback(async (message) => {
    // Validación básica
    const sanitizedMessage = sanitizeInput(message);
    const messageErrors = validateMessage(sanitizedMessage);
    
    if (messageErrors.length > 0) {
      setMessages((prev) => [...prev, { 
        text: `❌ ${messageErrors[0]}`, 
        sender: 'bot' 
      }]);
      return;
    }

    setMessages([...messages, { text: sanitizedMessage, sender: 'user' }]);
    setIsProcessing(true);

    try {
      const data = await apiService.sendMessage(sanitizedMessage, token);
      
      if (data.status === 'completed') {
        setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
      } else {
        throw new Error(data.message || 'Error del servidor');
      }
    } catch (error) {
      let errorMessage = 'Ha ocurrido un error inesperado.';
      
      if (error instanceof ApiError) {
        errorMessage = error.getDisplayMessage();
        
        // Auto-logout en caso de error de autenticación
        if (error.status === 401) {
          setTimeout(() => logout(), 2000);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessages((prev) => [...prev, { text: `❌ ${errorMessage}`, sender: 'bot' }]);
    } finally {
      setIsProcessing(false);
    }
  }, [messages, token, logout]);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <MarkdownMessage text={msg.text} className="markdown-message" />
          </div>
        ))}
        {isProcessing && (
          <div className="message bot isProcessing">
            <div className="typing-indicator">
              <span>ToyBot está pensando</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && e.target.value.trim()) {
            e.preventDefault();
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default Chat;
