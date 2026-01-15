import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';
import { Package, ShoppingCart, DollarSign, TrendingUp, Layers, Plus } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { Order, Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalVendas = orders.reduce((sum, order) => sum + order.total, 0);
  const totalPedidos = orders.length;
  const totalProdutos = products.length;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pendente: 'badge badge-warning',
      processando: 'badge badge-info',
      enviado: 'badge badge-info',
      entregue: 'badge badge-success',
      cancelado: 'badge badge-danger',
    };
    return badges[status] || 'badge';
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loading fullScreen />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Boas-vindas */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Bem-vindo, {user?.nome?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 text-sm md:text-base lg:text-lg">
          Gerencie sua loja, produtos e pedidos em um só lugar
        </p>
      </div>

      {/* Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Link 
          to="/admin/produtos" 
          className="group backdrop-blur-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-pink-500/20 rounded-lg md:rounded-xl group-hover:bg-pink-500/30 transition-colors">
              <Package className="text-pink-400" size={24} />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-white">Produtos</h3>
          </div>
          <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4">Adicione, edite e gerencie seus produtos</p>
          <div className="flex items-center text-pink-400 font-medium text-sm md:text-base">
            <Plus size={16} className="mr-1" />
            Adicionar
          </div>
        </Link>

        <Link 
          to="/admin/categorias" 
          className="group backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg md:rounded-xl group-hover:bg-purple-500/30 transition-colors">
              <Layers className="text-purple-400" size={24} />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-white">Categorias</h3>
          </div>
          <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4">Organize seus produtos</p>
          <div className="flex items-center text-purple-400 font-medium text-sm md:text-base">
            <Plus size={16} className="mr-1" />
            Criar
          </div>
        </Link>

        <Link 
          to="/admin/pedidos" 
          className="group backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg md:rounded-xl group-hover:bg-blue-500/30 transition-colors">
              <ShoppingCart className="text-blue-400" size={24} />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-white">Pedidos</h3>
          </div>
          <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4">Gerencie seus pedidos</p>
          <div className="flex items-center text-blue-400 font-medium text-sm md:text-base">
            Ver Todos →
          </div>
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total de Vendas</p>
              <p className="text-lg md:text-2xl font-bold break-words">R$ {totalVendas.toFixed(2)}</p>
            </div>
            <DollarSign className="text-green-600 flex-shrink-0" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Pedidos</p>
              <p className="text-lg md:text-2xl font-bold">{totalPedidos}</p>
            </div>
            <ShoppingCart className="text-blue-600 flex-shrink-0" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Produtos</p>
              <p className="text-lg md:text-2xl font-bold">{totalProdutos}</p>
            </div>
            <Package className="text-purple-600 flex-shrink-0" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Conversão</p>
              <p className="text-lg md:text-2xl font-bold">
                {totalProdutos > 0 ? ((totalPedidos / totalProdutos) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <TrendingUp className="text-orange-600 flex-shrink-0" size={32} />
          </div>
        </Card>
      </div>

      {/* Últimos Pedidos */}
      <Card title="Últimos Pedidos" className="mb-6 md:mb-8">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum pedido encontrado</p>
        ) : (
          <div className="overflow-x-auto -mx-4 md:-mx-0">
            <div className="inline-block min-w-full">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 md:py-3 px-4">Número</th>
                    <th className="text-left py-2 md:py-3 px-4 hidden sm:table-cell">Cliente</th>
                    <th className="text-left py-2 md:py-3 px-4">Status</th>
                    <th className="text-right py-2 md:py-3 px-4">Total</th>
                    <th className="text-left py-2 md:py-3 px-4 hidden lg:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 md:py-3 px-4 font-medium text-xs md:text-base">#{order.numero}</td>
                      <td className="py-2 md:py-3 px-4 hidden sm:table-cell text-xs md:text-base">{order.clienteNome}</td>
                      <td className="py-2 md:py-3 px-4">
                        <span className={getStatusBadge(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 md:py-3 px-4 text-right font-medium text-xs md:text-base">
                        R$ {order.total.toFixed(2)}
                      </td>
                      <td className="py-2 md:py-3 px-4 text-xs md:text-sm text-gray-600 hidden lg:table-cell">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
