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
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Bem-vindo, {user?.nome}! 👋
        </h1>
        <p className="text-gray-400 text-lg">
          Gerencie sua loja, produtos e pedidos em um só lugar
        </p>
      </div>

      {/* Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/admin/produtos" 
          className="group backdrop-blur-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-500/20 rounded-xl group-hover:bg-pink-500/30 transition-colors">
              <Package className="text-pink-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white">Produtos</h3>
          </div>
          <p className="text-gray-400 mb-4">Adicione, edite e gerencie seus produtos</p>
          <div className="flex items-center text-pink-400 font-medium">
            <Plus size={18} className="mr-1" />
            Adicionar Produto
          </div>
        </Link>

        <Link 
          to="/admin/categorias" 
          className="group backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
              <Layers className="text-purple-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white">Categorias</h3>
          </div>
          <p className="text-gray-400 mb-4">Organize seus produtos por categoria</p>
          <div className="flex items-center text-purple-400 font-medium">
            <Plus size={18} className="mr-1" />
            Criar Categoria
          </div>
        </Link>

        <Link 
          to="/admin/pedidos" 
          className="group backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
              <ShoppingCart className="text-blue-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-white">Pedidos</h3>
          </div>
          <p className="text-gray-400 mb-4">Acompanhe e gerencie seus pedidos</p>
          <div className="flex items-center text-blue-400 font-medium">
            Ver Todos →
          </div>
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Vendas</p>
              <p className="text-2xl font-bold">R$ {totalVendas.toFixed(2)}</p>
            </div>
            <DollarSign className="text-green-600" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pedidos</p>
              <p className="text-2xl font-bold">{totalPedidos}</p>
            </div>
            <ShoppingCart className="text-blue-600" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Produtos</p>
              <p className="text-2xl font-bold">{totalProdutos}</p>
            </div>
            <Package className="text-purple-600" size={40} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Taxa de Conversão</p>
              <p className="text-2xl font-bold">
                {totalProdutos > 0 ? ((totalPedidos / totalProdutos) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <TrendingUp className="text-orange-600" size={40} />
          </div>
        </Card>
      </div>

      {/* Últimos Pedidos */}
      <Card title="Últimos Pedidos" className="mb-8">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum pedido encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Número</th>
                  <th className="text-left py-3 px-4">Cliente</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{order.numero}</td>
                    <td className="py-3 px-4">{order.clienteNome}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      R$ {order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
