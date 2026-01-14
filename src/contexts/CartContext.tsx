import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, AddToCartData } from '../types';
import { cartService } from '../services/cartService';
import { v4 as uuidv4 } from 'uuid';

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
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [clienteId, setClienteId] = useState<string>('');

  useEffect(() => {
    let storedClienteId = localStorage.getItem('clienteId');
    if (!storedClienteId) {
      storedClienteId = uuidv4();
      localStorage.setItem('clienteId', storedClienteId);
    }
    setClienteId(storedClienteId);
    loadCart(storedClienteId);
  }, []);

  const loadCart = async (id: string) => {
    if (!id) return;
    
    try {
      setLoading(true);
      const cartData = await cartService.get(id);
      setCart(cartData);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      // Se o carrinho não existe, criar um novo
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (data: AddToCartData) => {
    if (!clienteId) {
      throw new Error('Cliente ID não disponível');
    }
    
    try {
      const updatedCart = await cartService.addItem(clienteId, data);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: number, quantidade: number) => {
    if (!clienteId) {
      throw new Error('Cliente ID não disponível');
    }
    
    try {
      const updatedCart = await cartService.updateItem(clienteId, itemId, { quantidade });
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  };

  const removeItem = async (itemId: number) => {
    if (!clienteId) {
      throw new Error('Cliente ID não disponível');
    }
    
    try {
      const updatedCart = await cartService.removeItem(clienteId, itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!clienteId) {
      throw new Error('Cliente ID não disponível');
    }
    
    try {
      await cartService.clear(clienteId);
      setCart(null);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    }
  };

  const refreshCart = async () => {
    if (clienteId) {
      await loadCart(clienteId);
    }
  };

  const itemsCount = cart?.itens?.reduce((sum, item) => sum + item.quantidade, 0) || 0;
  const total = cart?.itens?.reduce((sum, item) => sum + (item.produto?.preco || 0) * item.quantidade, 0) || 0;

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
