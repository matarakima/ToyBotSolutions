import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import { login } from '../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error);
      console.error('Login failed:', result.error);
    } else {
      setError('');
      console.log('Login successful:', result.token);
      navigate('/chat');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Login</h2>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Entrar</button>
        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
}
