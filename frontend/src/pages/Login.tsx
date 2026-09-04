import { useState, type SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginRequest } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await loginRequest({ email, password });
      login(data.user, data.token, rememberMe);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Credenciales inválidas');
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Inicio Sesion</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field">
            <label>Contraseña</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="checkbox-row">
            <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <label htmlFor="rememberMe">Recuérdame</label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>
        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;