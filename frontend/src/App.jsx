import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styles from './styles/App.module.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link to="/login" className={styles.navLink}>Login</Link>
        <Link to="/register" className={styles.navLink}>Registro</Link>
        <Link to="/chat" className={styles.navLink}>Chat</Link>
      </nav>
      <h1 className={styles.title}>Bienvenido a ToyBotSolutions</h1>
      <p className={styles.subtitle}>Este es el frontend minimalista. Inicia sesión, regístrate o accede al chat.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
