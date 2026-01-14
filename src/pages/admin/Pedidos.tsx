import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Eye, XCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

export function Pedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = statusFilter
        ? await orderService.getByStatus(statusFilter)
        : await orderService.getAll();
      setOrders(data);
    } catch (error) {
      showToast('Erro ao carregar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (id: number) => {
    try {
      const order = await orderService.getById(id);
      setSelectedOrder(order);
      setIsModalOpen(true);
    } catch (error) {
      showToast('Erro ao carregar detalhes do pedido', 'error');
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await orderService.updateStatus(id, {
        status: status as 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado',
      });
      showToast('Status atualizado com sucesso!', 'success');
      loadOrders();
      if (selectedOrder) {
        const updated = await orderService.getById(id);
        setSelectedOrder(updated);
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao atualizar status', 'error');
    }
  };

  const handleCancelOrder = async (id: number) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      try {
        await orderService.cancel(id);
        showToast('Pedido cancelado com sucesso!', 'success');
        setIsModalOpen(false);
        loadOrders();
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Erro ao cancelar pedido', 'error');
      }
    }
  };

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
      <h1 className="text-3xl font-bold mb-8">Pedidos</h1>

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <label className="font-medium">Filtrar por status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-64 text-gray-900"
          >
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="processando">Processando</option>
            <option value="enviado">Enviado</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </Card>

      <Card>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum pedido encontrado</p>
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
                  <th className="text-center py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{order.numero}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.clienteNome}</p>
                        <p className="text-sm text-gray-600">{order.clienteEmail}</p>
                      </div>
                    </td>
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
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          title="Ver detalhes"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Pedido #${selectedOrder?.numero}`}
        size="lg"
      >
        {selectedOrder && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Cliente</h3>
                <p>{selectedOrder.clienteNome}</p>
                <p className="text-sm text-gray-600">{selectedOrder.clienteEmail}</p>
                <p className="text-sm text-gray-600">{selectedOrder.clienteTelefone}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
                <p className="text-sm">{selectedOrder.clienteEndereco}</p>
              </div>
            </div>

            {selectedOrder.observacoes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Observações</h3>
                <p className="text-sm text-gray-600">{selectedOrder.observacoes}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Itens do Pedido</h3>
              <div className="space-y-2">
                {selectedOrder.itens.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.produto.nome}</p>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantidade} x R$ {item.precoUnitario.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {selectedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Atualizar Status</h3>
              <div className="flex gap-2 flex-wrap">
                {['pendente', 'processando', 'enviado', 'entregue'].map((status) => (
                  <Button
                    key={status}
                    variant={selectedOrder.status === status ? 'primary' : 'secondary'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    disabled={selectedOrder.status === status}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="danger"
                onClick={() => handleCancelOrder(selectedOrder.id)}
                disabled={selectedOrder.status === 'cancelado'}
              >
                <XCircle size={18} className="inline mr-2" />
                Cancelar Pedido
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast {...toast} onClose={hideToast} />
    </AdminLayout>
  );
}
