import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClientLayout } from '../../layouts/ClientLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Loading } from '../../components/Loading';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Package, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';

export function Rastreamento() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('numero') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const numero = searchParams.get('numero');
    if (numero) {
      handleSearch(numero);
    }
  }, []);

  const handleSearch = async (numero?: string) => {
    const searchNumber = numero || orderNumber;
    if (!searchNumber) {
      showToast('Digite o número do pedido', 'warning');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await orderService.getByNumber(searchNumber);
      setOrder(data);
    } catch (error: any) {
      setOrder(null);
      if (error.response?.status === 404) {
        showToast('Pedido não encontrado', 'error');
      } else {
        showToast('Erro ao buscar pedido', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      pendente: <Clock className="text-yellow-600" size={24} />,
      processando: <Package className="text-blue-600" size={24} />,
      enviado: <Truck className="text-purple-600" size={24} />,
      entregue: <CheckCircle className="text-green-600" size={24} />,
      cancelado: <XCircle className="text-red-600" size={24} />,
    };
    return icons[status] || <Package className="text-gray-600" size={24} />;
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pendente: 'Pedido pendente de processamento',
      processando: 'Pedido sendo preparado',
      enviado: 'Pedido enviado para entrega',
      entregue: 'Pedido entregue',
      cancelado: 'Pedido cancelado',
    };
    return texts[status] || status;
  };

  const statusSteps = ['pendente', 'processando', 'enviado', 'entregue'];
  const getCurrentStepIndex = (status: string) => {
    if (status === 'cancelado') return -1;
    return statusSteps.indexOf(status);
  };

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Rastrear Pedido</h1>

        <Card className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            <Input
              placeholder="Digite o número do pedido (ex: ABC123)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={() => handleSearch()} loading={loading}>
              Buscar
            </Button>
          </div>
        </Card>

        {loading && <Loading />}

        {!loading && searched && !order && (
          <Card className="max-w-2xl mx-auto text-center py-12">
            <Package size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Pedido não encontrado</h2>
            <p className="text-gray-600">
              Verifique o número do pedido e tente novamente.
            </p>
          </Card>
        )}

        {order && (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Pedido #{order.numero}</h2>
                  <p className="text-gray-600">
                    Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusIcon(order.status)}
                  <p className="font-semibold mt-2 capitalize">{order.status}</p>
                </div>
              </div>

              {/* Timeline de Status */}
              {order.status !== 'cancelado' && (
                <div className="mb-8">
                  <div className="flex justify-between relative">
                    <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-primary-600 transition-all duration-300"
                        style={{
                          width: `${(getCurrentStepIndex(order.status) / (statusSteps.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    {statusSteps.map((step, index) => {
                      const isActive = getCurrentStepIndex(order.status) >= index;
                      return (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                              isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {isActive ? <CheckCircle size={24} /> : <Clock size={24} />}
                          </div>
                          <p
                            className={`text-xs capitalize ${
                              isActive ? 'text-primary-600 font-medium' : 'text-gray-500'
                            }`}
                          >
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {order.status === 'cancelado' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">Este pedido foi cancelado</p>
                </div>
              )}

              <div className="bg-gray-100 rounded-lg p-4">
                <p className="font-medium">{getStatusText(order.status)}</p>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações do Cliente */}
              <Card>
                <h3 className="font-semibold text-lg mb-4">Informações de Entrega</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Nome</p>
                    <p className="font-medium">{order.clienteNome}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{order.clienteEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Telefone</p>
                    <p className="font-medium">{order.clienteTelefone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Endereço</p>
                    <p className="font-medium">{order.clienteEndereco}</p>
                  </div>
                  {order.observacoes && (
                    <div>
                      <p className="text-gray-600">Observações</p>
                      <p className="font-medium">{order.observacoes}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Resumo do Pedido */}
              <Card>
                <h3 className="font-semibold text-lg mb-4">Itens do Pedido</h3>
                <div className="space-y-3 mb-4">
                  {order.itens.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantidade}x {item.produto.nome}
                      </span>
                      <span className="font-medium">
                        R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Toast {...toast} onClose={hideToast} />
    </ClientLayout>
  );
}
