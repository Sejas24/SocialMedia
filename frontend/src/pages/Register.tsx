import { useState, type SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequest } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await registerRequest({ name, email, password });
      login(data.user, data.token, true);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error al registrarse');
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
        <div className="auth-logo">Registrar Usuario</div>
        <p className="auth-subtitle">Crea tu cuenta para empezar</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nombre</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;