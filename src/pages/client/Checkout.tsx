import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientLayout } from '../../layouts/ClientLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useCart } from '../../contexts/CartContext';
import { orderService } from '../../services/orderService';
import { CheckCircle } from 'lucide-react';

export function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    clienteNome: '',
    clienteEmail: '',
    clienteTelefone: '',
    clienteEndereco: '',
    observacoes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.itens.length === 0) {
      showToast('Carrinho vazio', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        itens: cart.itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.produto.preco,
        })),
      };

      const order = await orderService.create(orderData);
      setOrderNumber(order.numero);
      setOrderCreated(true);
      await clearCart();
      showToast('Pedido realizado com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao criar pedido', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.itens.length === 0) {
    navigate('/carrinho');
    return null;
  }

  if (orderCreated) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center py-12">
            <CheckCircle size={64} className="text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Pedido Realizado com Sucesso!</h1>
            <p className="text-gray-600 mb-6">
              Seu pedido foi registrado e está sendo processado.
            </p>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Número do Pedido</p>
              <p className="text-3xl font-bold text-primary-600">#{orderNumber}</p>
            </div>
            <p className="text-gray-600 mb-8">
              Obrigado pela sua compra!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/produtos')}>
                Continuar Comprando
              </Button>
            </div>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold mb-6">Dados de Entrega</h2>
              <form onSubmit={handleSubmit}>
                <Input
                  label="Nome Completo *"
                  name="clienteNome"
                  value={formData.clienteNome}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email *"
                    type="email"
                    name="clienteEmail"
                    value={formData.clienteEmail}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Telefone *"
                    name="clienteTelefone"
                    value={formData.clienteTelefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <Input
                  label="Endereço Completo *"
                  name="clienteEndereco"
                  value={formData.clienteEndereco}
                  onChange={handleChange}
                  placeholder="Rua, número, complemento, bairro, cidade, estado, CEP"
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    className="input-field min-h-[100px]"
                    placeholder="Informações adicionais sobre a entrega..."
                  />
                </div>

                <Button type="submit" className="w-full text-lg" loading={loading}>
                  Confirmar Pedido
                </Button>
              </form>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

              <div className="space-y-3 mb-6">
                {cart.itens.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantidade}x {item.produto.nome}
                    </span>
                    <span className="font-medium">
                      R$ {(item.quantidade * item.produto.preco).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded p-4 text-sm text-gray-600">
                <p>Ao confirmar o pedido, você concorda com nossos termos e condições.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </ClientLayout>
  );
}
