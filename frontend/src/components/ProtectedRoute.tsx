import { Navigate, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p style={{ textAlign: 'center', marginTop: 60 }}>Cargando...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;