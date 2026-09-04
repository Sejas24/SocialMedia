import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Social Blaugrana
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">Feed</Link>
          <Link to="/profile/me" className="navbar-link">Mi perfil</Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="navbar-link admin">Panel Admin</Link>
          )}

          <span className="navbar-user">👤 {user?.name}</span>

          <button onClick={handleLogout} className="btn btn-ghost">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;