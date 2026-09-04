import { useState, type SyntheticEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPasswordRequest } from '../services/auth.service';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await resetPasswordRequest({ token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Token inválido o expirado');
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">Recuperar Contraseña</div>
          <p className="success-text">¡Contraseña actualizada! Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Recuperar Contraseña</div>
        <p className="auth-subtitle">Restablece tu contraseña</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Token de recuperación</label>
            <input
              type="text"
              className="input"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Nueva contraseña</label>
            <input
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="field">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Actualizando...' : 'Restablecer contraseña'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;