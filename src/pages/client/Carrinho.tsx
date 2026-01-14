import { Link } from 'react-router-dom';
import { ClientLayout } from '../../layouts/ClientLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useCart } from '../../contexts/CartContext';

export function Carrinho() {
  const { cart, loading, total, updateQuantity, removeItem, clearCart } = useCart();
  const { toast, showToast, hideToast } = useToast();

  const handleUpdateQuantity = async (itemId: number, quantidade: number) => {
    try {
      await updateQuantity(itemId, quantidade);
    } catch (error) {
      showToast('Erro ao atualizar quantidade', 'error');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItem(itemId);
      showToast('Item removido do carrinho', 'success');
    } catch (error) {
      showToast('Erro ao remover item', 'error');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      try {
        await clearCart();
        showToast('Carrinho limpo com sucesso', 'success');
      } catch (error) {
        showToast('Erro ao limpar carrinho', 'error');
      }
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <Loading fullScreen />
      </ClientLayout>
    );
  }

  if (!cart || cart.itens.length === 0) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-16">
          <Card className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos para começar suas compras</p>
            <Link to="/produtos">
              <Button>Ir para Produtos</Button>
            </Link>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meu Carrinho</h1>
          <Button variant="danger" onClick={handleClearCart}>
            Limpar Carrinho
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Itens */}
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-4">
                {cart.itens.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <Link to={`/produto/${item.produto.id}`}>
                      {item.produto.imagem ? (
                        <img
                          src={item.produto.imagem}
                          alt={item.produto.nome}
                          className="w-24 h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sem imagem</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1">
                      <Link to={`/produto/${item.produto.id}`}>
                        <h3 className="font-semibold text-lg mb-1 hover:text-primary-600">
                          {item.produto.nome}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-2">
                        R$ {item.produto.preco.toFixed(2)} cada
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)}
                            disabled={item.quantidade <= 1}
                            className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-1 font-medium">{item.quantidade}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)}
                            disabled={item.quantidade >= item.produto.quantidade}
                            className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Remover</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-600">
                        R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full text-lg">
                  Finalizar Compra
                </Button>
              </Link>

              <Link to="/produtos">
                <Button variant="secondary" className="w-full mt-3">
                  Continuar Comprando
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </ClientLayout>
  );
}
