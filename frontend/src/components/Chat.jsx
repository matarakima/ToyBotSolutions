import React, { useState } from 'react';
import '../styles/Chat.css';

const API_URL = import.meta.env.VITE_API_URL;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (message) => {
    setMessages([...messages, { text: message, sender: 'user' }]);
    setIsProcessing(true); // Activa el indicador de carga

    try {
      const token = localStorage.getItem('jwt'); // Recupera el token almacenado después del login
      if (!token) {
        throw new Error('No se encontró un token de autenticación. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: 'Error: Unable to process your request.', sender: 'bot' }]);
    } finally {
      setIsProcessing(false); // Desactiva el indicador de carga
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isProcessing && (
          <div className="message bot isProcessing">...</div> // Indicador de carga
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
