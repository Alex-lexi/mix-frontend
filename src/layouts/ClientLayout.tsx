import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { itemsCount } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2d1b4e]">
      {/* Header */}
      <header className="bg-[#1a0b2e]/95 backdrop-blur-md shadow-xl sticky top-0 z-40 border-b border-pink-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="MIX Catálogo Digital" className="h-14 w-auto brightness-0 invert" />
            </Link>

            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="O que você procura?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none bg-[#2d1b4e]/50 text-white placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            <nav className="flex items-center gap-6">
              <Link to="/produtos" className="text-gray-300 hover:text-pink-400 font-medium transition-all">
                Produtos
              </Link>
              <Link to="/rastreamento" className="text-gray-300 hover:text-pink-400 font-medium transition-all">
                Rastrear Pedido
              </Link>
              <Link to="/carrinho" className="relative">
                <ShoppingCart className="text-gray-300 hover:text-pink-400 transition-colors" size={26} />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                    {itemsCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#0f0620] text-white mt-16 border-t border-pink-500/20">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/logo.svg" alt="MIX" className="h-16 w-auto mb-4 brightness-0 invert opacity-80" />
              <p className="text-gray-400">Seu mix organizado. Seu atendimento mais rápido.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg text-pink-400">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/produtos" className="hover:text-pink-400 transition-colors">Produtos</Link></li>
                <li><Link to="/rastreamento" className="hover:text-pink-400 transition-colors">Rastrear Pedido</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg text-pink-400">Contato</h4>
              <p className="text-gray-400">contato@mixcatalogo.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2026 MIX Catálogo Digital. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
