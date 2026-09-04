import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '../services/auth.service';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setResetToken(null);
    setLoading(true);

    try {
      const { data } = await forgotPasswordRequest({ email });
      setMessage(data.message);
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error al procesar la solicitud');
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
        <div className="auth-logo">Recuperar Contraseña</div>
        <p className="auth-subtitle">Ingresa tu email y generaremos un token de recuperación</p>

        <form onSubmit={handleSubmit}>
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

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Enviando...' : 'Generar token'}
          </button>
        </form>

        {resetToken && (
          <div className="token-box">
            <p>Token de recuperación:</p>
            <code>{resetToken}</code>
            <Link to={`/reset-password?token=${resetToken}`} className="btn-link">
              Ir a restablecer contraseña →
            </Link>
          </div>
        )}

        <p className="auth-footer">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;