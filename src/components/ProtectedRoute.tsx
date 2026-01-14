import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: ('admin' | 'vendedor' | 'cliente')[];
}

export function ProtectedRoute({ children, allowedTypes }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se allowedTypes foi especificado, verificar se o usuário tem permissão
  if (allowedTypes && !allowedTypes.includes(user.tipo)) {
    // Redirecionar para a página apropriada baseado no tipo do usuário
    if (user.tipo === 'cliente') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Se allowedTypes não foi especificado, permitir apenas admin e vendedor (comportamento padrão para rotas admin)
  if (!allowedTypes && user.tipo !== 'admin' && user.tipo !== 'vendedor') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
