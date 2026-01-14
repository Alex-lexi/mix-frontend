import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Eye, EyeOff } from 'lucide-react';

export function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState<'cliente' | 'vendedor'>('cliente');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  
  // Verificar se usuário logado é admin
  const isAdmin = user?.tipo === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    if (senha.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres', 'error');
      return;
    }
    
    // Verificar se está tentando criar vendedor sem ser admin
    if (tipo === 'vendedor' && !isAdmin) {
      showToast('Apenas administradores podem criar contas de vendedor', 'error');
      return;
    }

    setLoading(true);

    try {
      await register({
        nome,
        email,
        senha,
        tipo,
        telefone: telefone || undefined,
      });
      showToast('Cadastro realizado com sucesso!', 'success');
      
      // Redireciona baseado no tipo de usuário
      setTimeout(() => {
        if (tipo === 'vendedor' || tipo === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao fazer cadastro', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{
      background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)'
    }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="MIX Logo" className="h-16 mx-auto mb-4 rounded-md" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Criar Conta
          </h1>
          <p className="text-gray-400 mt-2">Preencha os dados para começar</p>
        </div>

        {/* Card de Cadastro */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome Completo"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              required
              className="bg-white/5 border-white/10 text-gray-700 placeholder:text-gray-400"
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-white/5 border-white/10 text-gray-700 placeholder:text-gray-400"
            />

            <Input
              label="Telefone (opcional)"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="bg-white/5 border-white/10 text-gray-700 placeholder:text-gray-400"
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

            <div className="relative">
              <Input
                label="Confirmar Senha"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/5 border-white/10 text-gray-700 placeholder:text-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Tipo de Usuário */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Tipo de Conta
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipo('cliente')}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                    tipo === 'cliente'
                      ? 'border-pink-500 bg-pink-500/20 text-gray-700'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-center text-gray-900">
                    <div className="text-2xl mb-1">🛍️</div>
                    <div className="font-semibold">Cliente</div>
                    <div className="text-xs mt-1 opacity-80">Fazer compras</div>
                  </div>
                </button>
                
                {/* Mostrar opção de vendedor apenas para admin */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setTipo('vendedor')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      tipo === 'vendedor'
                        ? 'border-purple-500 bg-purple-500/20 text-gray-700'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">💼</div>
                      <div className="font-semibold">Vendedor</div>
                      <div className="text-xs mt-1 opacity-80">Gerenciar loja</div>
                    </div>
                  </button>
                )}
              </div>
              
              {/* Aviso se tentar criar vendedor sem ser admin */}
              {!isAdmin && (
                <p className="text-xs text-gray-400 mt-2">
                  Apenas administradores podem criar contas de vendedor. Se você deseja vender, entre em contato com o administrador.
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300" 
              loading={loading}
            >
              Criar Conta
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
              >
                Fazer login
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
