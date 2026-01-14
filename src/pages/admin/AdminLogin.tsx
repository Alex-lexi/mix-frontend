import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function AdminLogin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para o dashboard se já estiver logado como vendedor
    if (user && user.tipo === 'vendedor') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      // Redireciona para a página de login moderna
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  return null;
}
