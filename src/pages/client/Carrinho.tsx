import { Link } from 'react-router-dom';
import { ClientLayout } from '../../layouts/ClientLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Trash2, Minus, Plus, ShoppingBag, LogIn } from 'lucide-react';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

export function Carrinho() {
  const { cart, loading, total, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    console.log('🛒 [Carrinho] Página montada');
    console.log('  - Estado do carrinho:', cart);
    console.log('  - Loading:', loading);
    console.log('  - Total de itens:', cart?.itens?.length || 0);
    console.log('  - Usuário:', user);
  }, [cart, loading, user]);

  const handleUpdateQuantity = async (itemId: number, quantidade: number) => {
    try {
      await updateQuantity(itemId, quantidade);
    } catch (error) {
      showToast('Erro ao atualizar quantidade', 'error');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    console.log('🖱️ [Carrinho] Botão remover clicado');
    console.log('  - ItemId:', itemId);
    console.log('  - Carrinho atual:', cart);
    console.log('  - Item encontrado:', cart?.itens.find(item => item.id === itemId));
    
    try {
      console.log('⏳ [Carrinho] Chamando removeItem...');
      await removeItem(itemId);
      console.log('✅ [Carrinho] RemoveItem concluído');
      showToast('Item removido do carrinho', 'success');
    } catch (error: any) {
      console.error('❌ [Carrinho] Erro ao remover item:', error);
      console.error('  - Mensagem:', error.message);
      console.error('  - Stack:', error.stack);
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

  // Verifica se usuário está logado
  if (!user) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Card className="text-center py-12 md:py-16">
            <LogIn size={48} className="mx-auto text-pink-400 mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Faça login para ver seu carrinho</h2>
            <p className="text-gray-400 mb-6 text-sm md:text-base">Você precisa estar logado para adicionar produtos ao carrinho</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button className="w-full">Fazer Login</Button>
              </Link>
              <Link to="/cadastro" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full">Criar Conta</Button>
              </Link>
            </div>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  if (!cart || cart.itens.length === 0) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Card className="text-center py-12 md:py-16">
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Seu carrinho está vazio</h2>
            <p className="text-gray-400 mb-6 text-sm md:text-base">Adicione produtos para começar suas compras</p>
            <Link to="/">
              <Button>Ir para Produtos</Button>
            </Link>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Meu Carrinho</h1>
          <Button variant="danger" onClick={handleClearCart} size="sm">
            Limpar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Lista de Itens */}
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-3 md:space-y-4">
                {cart.itens.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 md:gap-4 p-3 md:p-4 border-b rounded-md last:border-b-0 hover:bg-purple-300/30"
                  >
                    <Link to={`/produto/${item.produto.id}`} className="flex-shrink-0">
                      {item.produto.imagem ? (
                        <img
                          src={item.produto.imagem}
                          alt={item.produto.nome}
                          className="w-20 md:w-24 h-20 md:h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 md:w-24 h-20 md:h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sem imagem</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/produto/${item.produto.id}`}>
                        <h3 className="font-semibold text-sm md:text-lg mb-1 hover:text-primary-600 line-clamp-2">
                          {item.produto.nome}
                        </h3>
                      </Link>
                      
                      {/* Preço com suporte a promoção */}
                      {item.produto.emPromocao && item.produto.precoPromocional ? (
                        <div className="mb-2">
                          <span className="bg-red-500 text-white text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded mr-2">
                            PROMO
                          </span>
                          <p className="text-gray-400 line-through text-xs md:text-sm inline">
                            R$ {item.produto.preco.toFixed(2)}
                          </p>
                          <p className="text-green-600 font-semibold text-base md:text-lg">
                            R$ {item.produto.precoPromocional.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-600 mb-2 text-sm md:text-base">
                          R$ {item.produto.preco.toFixed(2)}
                        </p>
                      )}

                      <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)}
                            disabled={item.quantidade <= 1}
                            className="px-1.5 md:px-2 py-1 hover:text-red-300 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 md:px-4 py-1 font-medium text-sm md:text-base">{item.quantidade}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)}
                            disabled={item.quantidade >= item.produto.quantidade}
                            className="px-1.5 md:px-2 py-1 hover:text-green-300 cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer text-xs md:text-sm"
                        >
                          <Trash2 size={14} />
                          <span className="font-semibold">Remover</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {/* Calcula subtotal considerando preço promocional */}
                      {(() => {
                        const preco = item.produto.emPromocao && item.produto.precoPromocional 
                          ? item.produto.precoPromocional 
                          : item.produto.preco;
                        const subtotal = preco * item.quantidade;
                        
                        return (
                          <p className="text-base md:text-xl font-bold text-primary-600">
                            R$ {subtotal.toFixed(2)}
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-16 md:top-20">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Resumo do Pedido</h2>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Frete</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
                <div className="border-t pt-2 md:pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg md:text-2xl font-bold text-primary-600">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/checkout" className="block w-full mb-2 md:mb-3">
                <Button className="w-full text-sm md:text-base hover:bg-green-100 hover:text-gray-900">
                  Finalizar
                </Button>
              </Link>

              <Link to="/produtos">
                <Button variant="secondary" className="w-full text-sm md:text-base">
                  Continuar
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
