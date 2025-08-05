import React, { useState } from 'react';
import '../styles/Chat.css';
import MarkdownMessage from './MarkdownMessage';

const API_URL = import.meta.env.VITE_API_URL;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (message) => {
    // Validación básica
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return; // No enviar mensajes vacíos
    }
    
    if (trimmedMessage.length > 500) {
      setMessages((prev) => [...prev, { 
        text: 'Tu mensaje es muy largo. Por favor, mantén tus preguntas bajo 500 caracteres.', 
        sender: 'bot' 
      }]);
      return;
    }

    setMessages([...messages, { text: trimmedMessage, sender: 'user' }]);
    setIsProcessing(true); // Activa el indicador de carga

    try {
      const token = localStorage.getItem('jwt'); // Recupera el token almacenado después del login
      if (!token) {
        throw new Error('No se encontró un token de autenticación. Por favor, inicia sesión.');
      }

      // Crear un timeout para la request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 segundos timeout

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado
        },
        body: JSON.stringify({ message: trimmedMessage }),
        signal: controller.signal, // Agregar signal para timeout
      });

      clearTimeout(timeoutId); // Limpiar timeout si la request fue exitosa

      const data = await response.json();
      console.log('Respuesta del backend:', data); // Log para depurar

      // Verificar si la respuesta indica un error
      if (data.status === 'error') {
        throw new Error(data.message || 'Error del servidor');
      }

      // Verificar si la respuesta tiene el formato esperado
      const botMessage = data.response || data.message || 'No hay respuesta del servidor';
      setMessages((prev) => [...prev, { text: botMessage, sender: 'bot' }]);
    } catch (error) {
      console.error('Error en el chat:', error); // Log del error
      
      let errorMessage = 'Ha ocurrido un error inesperado.';
      if (error.name === 'AbortError') {
        errorMessage = 'La consulta está tomando demasiado tiempo. Por favor, intenta de nuevo.';
      } else if (error.message.includes('token')) {
        errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessages((prev) => [...prev, { text: `❌ ${errorMessage}`, sender: 'bot' }]);
    } finally {
      setIsProcessing(false); // Desactiva el indicador de carga
    }
  };

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
          if (e.key === 'Enter' && e.target.value.trim()) {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default Chat;
