import { useState } from 'react';
import { getToken, logout } from '../services/authService';
import styles from '../styles/Form.module.css';
import MarkdownMessage from '../components/MarkdownMessage';

const chatStyles = {
  chatBox: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 16px #6366f122',
    padding: 24,
    width: 340,
    minHeight: 320,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
    overflowY: 'auto',
    maxHeight: 400
  },
  msgUser: {
    alignSelf: 'flex-end',
    background: '#6366f1',
    color: '#fff',
    borderRadius: '16px 16px 0 16px',
    padding: '8px 16px',
    maxWidth: '80%',
    marginBottom: 4
  },
  msgBot: {
    alignSelf: 'flex-start',
    background: '#e0e7ff',
    color: '#222',
    borderRadius: '16px 16px 16px 0',
    padding: '8px 16px',
    maxWidth: '80%',
    marginBottom: 4
  }
};

export default function Chat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError('No autenticado');
      return;
    }
    setChat(prev => [...prev, { sender: 'user', text: message }]);
    setMessage('');
    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (res.ok) {
        setChat(prev => [...prev, { sender: 'bot', text: data.response }]);
        setError('');
      } else {
        setChat(prev => [...prev, { sender: 'bot', text: data.error || 'Error en el chat' }]);
        setError(data.error || 'Error en el chat');
      }
    } catch (err) {
      setChat(prev => [...prev, { sender: 'bot', text: 'Error de conexión' }]);
      setError('Error de conexión');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      <div style={chatStyles.chatBox}>
        {chat.length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>¡Comienza la conversación!</div>}
        {chat.map((msg, i) => (
          msg.sender === 'user' ? (
            <div key={i} style={chatStyles.msgUser}>{msg.text}</div>
          ) : (
            <MarkdownMessage key={i} text={msg.text} className="chat-markdown" style={chatStyles.msgBot} />
          )
        ))}
      </div>
      <form className={styles.formContainer} style={{ boxShadow: 'none', padding: 0, width: 340 }} onSubmit={handleSend}>
        <textarea
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          className={styles.input}
          style={{ resize: 'vertical', minHeight: 40 }}
        />
        <button type="submit" className={styles.button} style={{ marginTop: 8 }}>Enviar</button>
        {error && <div className={styles.error}>{error}</div>}
      </form>
      <button className={styles.logout} onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
