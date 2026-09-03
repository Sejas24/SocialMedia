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
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h1>Recuperar contraseña</h1>
      <p style={{ color: '#666', fontSize: 14 }}>
        Ingresa tu email y generaremos un token de recuperación.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Enviando...' : 'Generar token'}
        </button>
      </form>

      {resetToken && (
        <div style={{ marginTop: 20, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
            ⚠️ Modo demostración: en producción este token llegaría por correo, no se mostraría aquí.
          </p>
          <p style={{ wordBreak: 'break-all', fontSize: 12 }}>
            <strong>Token:</strong> {resetToken}
          </p>
          <Link to={`/reset-password?token=${resetToken}`}>
            Ir a restablecer contraseña →
          </Link>
        </div>
      )}

      <p style={{ marginTop: 16 }}>
        <Link to="/login">Volver a iniciar sesión</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;