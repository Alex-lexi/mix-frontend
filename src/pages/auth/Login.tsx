import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Eye, EyeOff } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, senha);
      showToast('Login realizado com sucesso!', 'success');
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect');
      
      // Redireciona baseado no tipo de usuário
      setTimeout(() => {
        if (redirect) {
          navigate(redirect, { replace: true });
        } else if (user.tipo === 'admin' || user.tipo === 'vendedor') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 1000);
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
          <img src="/logo.png" alt="MIX Logo" className="h-16 mx-auto mb-4 rounded-md" />
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
              className="bg-white/5 border-white/10 text-gray-800 placeholder:text-gray-400"
            />

            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/5 border-white/10 text-gray-700 placeholder:text-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-pink-500/50 transition-all duration-300 cursor-pointer" 
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
