import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, AddToCartData } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextData {
  cart: Cart | null;
  loading: boolean;
  itemsCount: number;
  total: number;
  addToCart: (data: AddToCartData) => Promise<void>;
  updateQuantity: (itemId: number, quantidade: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  addItem: (produtoId: number, quantidade: number) => Promise<void>;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    console.log('🔄 [CartContext] useEffect - user/token mudou');
    console.log('  - User:', user);
    console.log('  - Token:', token ? 'presente' : 'ausente');
    
    if (token && user) {
      loadCart();
    } else {
      console.log('⚠️ [CartContext] Usuário não autenticado, limpando carrinho');
      setCart(null);
      setLoading(false);
    }
  }, [token, user]);

  const loadCart = async () => {
    console.log('🔄 [CartContext] Carregando carrinho');
    
    try {
      setLoading(true);
      console.log('📡 [CartContext] Buscando carrinho...');
      const cartData = await cartService.get();
      console.log('✅ [CartContext] Carrinho carregado:', cartData);
      console.log('  - Itens no carrinho:', cartData?.itens?.length || 0);
      setCart(cartData);
    } catch (error: any) {
      console.error('❌ [CartContext] Erro ao carregar carrinho:', error);
      // Se erro 404, carrinho não existe ainda (será criado ao adicionar item)
      if (error.response?.status === 404) {
        console.log('ℹ️ [CartContext] Carrinho não existe, será criado ao adicionar item');
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (data: AddToCartData) => {
    console.log('🛒 [CartContext] Adicionando item ao carrinho');
    console.log('  - Data:', data);
    console.log('  - User:', user);
    
    if (!user || !token) {
      console.error('❌ [CartContext] Usuário não autenticado');
      throw new Error('Você precisa estar logado para adicionar itens ao carrinho');
    }
    
    try {
      console.log('📡 [CartContext] Chamando cartService.addItem...');
      const updatedCart = await cartService.addItem(data);
      console.log('✅ [CartContext] Item adicionado com sucesso');
      console.log('  - Carrinho atualizado:', updatedCart);
      setCart(updatedCart);
    } catch (error: any) {
      console.error('❌ [CartContext] Erro ao adicionar ao carrinho:', error);
      console.error('  - Detalhes:', error.response?.data);
      throw error;
    }
  };

  // Função auxiliar para compatibilidade
  const addItem = async (produtoId: number, quantidade: number) => {
    return addToCart({ produtoId, quantidade });
  };

  const updateQuantity = async (itemId: number, quantidade: number) => {
    console.log('📝 [CartContext] Atualizando quantidade');
    console.log('  - ItemId:', itemId);
    console.log('  - Quantidade:', quantidade);
    
    if (!user || !token) {
      console.error('❌ [CartContext] Usuário não autenticado');
      throw new Error('Você precisa estar logado');
    }
    
    try {
      console.log('📡 [CartContext] Chamando cartService.updateItem...');
      const updatedCart = await cartService.updateItem(itemId, { quantidade });
      console.log('✅ [CartContext] Quantidade atualizada');
      console.log('  - Carrinho atualizado:', updatedCart);
      setCart(updatedCart);
    } catch (error: any) {
      console.error('❌ [CartContext] Erro ao atualizar quantidade:', error);
      console.error('  - Detalhes:', error.response?.data);
      throw error;
    }
  };

  const removeItem = async (itemId: number) => {
    console.log('🗑️ [CartContext] Iniciando remoção de item');
    console.log('  - ItemId:', itemId);
    console.log('  - User:', user);
    console.log('  - Carrinho atual:', cart);
    
    if (!user || !token) {
      console.error('❌ [CartContext] Usuário não autenticado');
      throw new Error('Você precisa estar logado');
    }
    
    try {
      console.log('📡 [CartContext] Chamando cartService.removeItem...');
      const updatedCart = await cartService.removeItem(itemId);
      console.log('✅ [CartContext] Item removido com sucesso');
      console.log('  - Carrinho atualizado:', updatedCart);
      setCart(updatedCart);
    } catch (error) {
      console.error('❌ [CartContext] Erro ao remover item:', error);
      console.error('  - Detalhes do erro:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const clearCart = async () => {
    console.log('🗑️ [CartContext] Limpando carrinho');
    
    if (!user || !token) {
      console.error('❌ [CartContext] Usuário não autenticado');
      throw new Error('Você precisa estar logado');
    }
    
    try {
      console.log('📡 [CartContext] Chamando cartService.clear...');
      await cartService.clear();
      console.log('✅ [CartContext] Carrinho limpo');
      setCart(null);
    } catch (error: any) {
      console.error('❌ [CartContext] Erro ao limpar carrinho:', error);
      console.error('  - Detalhes:', error.response?.data);
      throw error;
    }
  };

  const refreshCart = async () => {
    if (user && token) {
      await loadCart();
    }
  };

  const itemsCount = cart?.itens?.reduce((sum, item) => sum + item.quantidade, 0) || 0;
  
  // Calcula total considerando preço promocional
  const total = cart?.itens?.reduce((sum, item) => {
    const preco = item.produto?.emPromocao && item.produto?.precoPromocional 
      ? item.produto.precoPromocional 
      : item.produto?.preco || 0;
    return sum + preco * item.quantidade;
  }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemsCount,
        total,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        addItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
