import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  User,
  Users,
  LogOut,
  Tag,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', adminOnly: false },
    { path: '/admin/vendedores', icon: Users, label: 'Vendedores', adminOnly: true },
    { path: '/admin/produtos', icon: Package, label: 'Produtos', adminOnly: false },
    { path: '/admin/promocoes', icon: Tag, label: 'Promoções', adminOnly: false },
    { path: '/admin/categorias', icon: FolderTree, label: 'Categorias', adminOnly: false },
    { path: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos', adminOnly: false },
    { path: '/admin/perfil', icon: User, label: 'Perfil', adminOnly: false },
  ];
  
  const isAdmin = user?.tipo === 'admin';

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a0b2e] to-[#2d1b4e] flex-col md:flex-row">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <div className="md:hidden bg-[#0f0620]/90 border-b border-pink-500/20 p-4 flex items-center justify-between z-50 relative">
        <img src="/logo.png" alt="MIX" className="h-10 w-auto rounded-md" />
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white p-2"
          title={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${
        isSidebarOpen ? 'block' : 'hidden'
      } md:block fixed md:relative md:w-64 inset-0 md:inset-auto bg-[#0f0620]/90 backdrop-blur-md shadow-2xl border-r border-pink-500/20 overflow-y-auto z-40 md:z-auto w-full md:w-64 flex flex-col`}>
        {/* Desktop Header */}
        <div className="hidden md:block p-6 border-b border-pink-500/20">
          <img src="/logo.png" alt="MIX" className="h-14 w-auto mb-3 rounded-md" />
          <h1 className="text-lg font-bold text-pink-400">Admin Panel</h1>
          {user && (
            <p className="text-sm text-gray-300 mt-2 font-medium">Olá, {user.nome.split(' ')[0]}</p>
          )}
        </div>

        {/* Mobile User Info */}
        <div className="md:hidden p-4 border-b border-pink-500/20">
          {user && (
            <>
              <h1 className="text-base font-bold text-pink-400 mb-1">Admin Panel</h1>
              <p className="text-sm text-gray-300 font-medium">Olá, {user.nome.split(' ')[0]}</p>
            </>
          )}
        </div>

        <nav className="p-4">
          {menuItems
            .filter(item => !item.adminOnly || isAdmin)
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all font-medium text-sm md:text-base ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-[#2d1b4e] hover:text-pink-400'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 w-full transition-all mt-4 shadow-lg font-medium cursor-pointer text-sm md:text-base"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
