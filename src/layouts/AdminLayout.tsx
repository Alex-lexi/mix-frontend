import { ReactNode } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="flex h-screen bg-gradient-to-br from-[#1a0b2e] to-[#2d1b4e]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f0620]/90 backdrop-blur-md shadow-2xl border-r border-pink-500/20">
        <div className="p-6 border-b border-pink-500/20">
          <img src="/logo.png" alt="MIX" className="h-14 w-auto mb-3 rounded-md" />
          <h1 className="text-lg font-bold text-pink-400">Admin Panel</h1>
          {user && (
            <p className="text-sm text-gray-300 mt-2 font-medium">Olá, {user.nome}</p>
          )}
        </div>

        <nav className="p-4">
          {menuItems
            .filter(item => !item.adminOnly || isAdmin) // Mostrar item apenas se não for adminOnly ou se usuário for admin
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all font-medium ${
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
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2 text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 w-full transition-all mt-4 shadow-lg font-medium cursor-pointer"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
