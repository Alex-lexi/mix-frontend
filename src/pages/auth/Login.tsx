import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, senha);
      showToast('Login realizado com sucesso!', 'success');
      
      // Redireciona baseado no tipo de usuário
      if (user.tipo === 'vendedor') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao fazer login', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)'
    }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="MIX Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-400 mt-2">Entre na sua conta para continuar</p>
        </div>

        {/* Card de Login */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />

            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-pink-500/50 transition-all duration-300" 
              loading={loading}
            >
              Entrar
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{' '}
              <Link 
                to="/cadastro" 
                className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
            <Link 
              to="/" 
              className="text-gray-400 hover:text-white text-sm transition-colors block"
            >
              Voltar para a loja
            </Link>
          </div>
        </div>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </div>
  );
}
