import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { Order, Product } from '../../types';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

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
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

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
