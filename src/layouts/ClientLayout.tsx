import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface ClientLayoutProps {
  children: ReactNode;
  onSearch?: (term: string) => void;
}

export function ClientLayout({ children, onSearch }: ClientLayoutProps) {
  const { itemsCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2d1b4e]">
      {/* Header */}
      <header className="bg-[#1a0b2e]/95 backdrop-blur-md shadow-xl sticky top-0 z-40 border-b border-pink-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src="/logo.png" alt="MIX Catálogo Digital" className="rounded-md h-12 md:h-14 w-auto" />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="O que você procura?"
                  value={localSearchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none bg-[#2d1b4e]/50 text-white placeholder-gray-400 transition-all text-sm"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              <Link to="/produtos" className="text-gray-300 hover:text-pink-400 font-medium transition-all text-sm lg:text-base">
                Produtos
              </Link>
              
              {/* Auth Section */}
              {user ? (
                <div className="flex items-center gap-3 lg:gap-4">
                  {(user.tipo === 'admin' || user.tipo === 'vendedor') && (
                    <Link 
                      to="/admin/dashboard" 
                      className="px-3 lg:px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all text-sm"
                    >
                      Painel
                    </Link>
                  )}
                  <div className="text-gray-300 text-xs lg:text-sm">
                    Olá, <span className="font-semibold text-pink-400">{user.nome.split(' ')[0]}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Sair"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/50 transition-all text-sm"
                >
                  <User size={18} />
                  Entrar
                </Link>
              )}
              
              <Link to="/carrinho" className="relative">
                <ShoppingCart className="text-gray-300 hover:text-pink-400 transition-colors" size={24} />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                    {itemsCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* Mobile Icons Container */}
            <div className="md:hidden flex items-center gap-2">
              {/* Cart Icon - Mobile */}
              <Link to="/carrinho" className="relative">
                <ShoppingCart className="text-gray-300 hover:text-pink-400 transition-colors" size={22} />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {itemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2"
                title={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-pink-500/20">
              {/* Search Bar - Mobile */}
              <div className="mb-4 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="O que você procura?"
                    value={localSearchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none bg-[#2d1b4e]/50 text-white placeholder-gray-400 transition-all text-sm"
                  />
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                <Link 
                  to="/produtos" 
                  className="text-gray-300 hover:text-pink-400 font-medium transition-all text-sm px-2 py-2 hover:bg-[#2d1b4e]/50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Produtos
                </Link>
                
                {user ? (
                  <>
                    {(user.tipo === 'admin' || user.tipo === 'vendedor') && (
                      <Link 
                        to="/admin/dashboard" 
                        className="px-2 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Painel {user.tipo === 'admin' ? 'Admin' : 'Vendedor'}
                      </Link>
                    )}
                    <div className="text-gray-300 text-xs px-2 py-2">
                      Olá, <span className="font-semibold text-pink-400">{user.nome.split(' ')[0]}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-white bg-red-600 px-2 py-2 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors w-full cursor-pointer"
                    >
                      <LogOut size={18} />
                      Sair
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 px-2 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    Entrar
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#0f0620] text-white mt-12 md:mt-16 border-t border-pink-500/20">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <img src="/logo.png" alt="MIX" className="rounded-md h-16 w-auto mb-4 opacity-80" />
              <p className="text-gray-400 text-sm md:text-base">Seu mix organizado. Seu atendimento mais rápido.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base md:text-lg text-pink-400">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/produtos" className="hover:text-pink-400 transition-colors">Produtos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base md:text-lg text-pink-400">Contato</h4>
              <p className="text-gray-400 text-sm">contato@mixcatalogo.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 MIX Catálogo Digital. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
