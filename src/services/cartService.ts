import api from './api';
import { Cart, AddToCartData, UpdateCartItemData } from '../types';

export const cartService = {
  async get(): Promise<Cart> {
    console.log('📡 [cartService] Buscando carrinho do usuário autenticado');
    const response = await api.get('/carrinho');
    console.log('✅ [cartService] Carrinho recebido:', response.data);
    return response.data.data || response.data;
  },

  async addItem(data: AddToCartData): Promise<Cart> {
    console.log('📡 [cartService] Adicionando item ao carrinho');
    console.log('  - Data:', data);
    const response = await api.post('/carrinho/adicionar', data);
    console.log('✅ [cartService] Item adicionado:', response.data);
    return response.data.data || response.data;
  },

  async updateItem(itemId: number, data: UpdateCartItemData): Promise<Cart> {
    console.log('📡 [cartService] Atualizando item do carrinho');
    console.log('  - ItemId:', itemId);
    console.log('  - Data:', data);
    const response = await api.put(`/carrinho/itens/${itemId}`, data);
    console.log('✅ [cartService] Item atualizado:', response.data);
    return response.data.data || response.data;
  },

  async removeItem(itemId: number): Promise<Cart> {
    console.log('🌐 [cartService] Enviando requisição DELETE para remover item');
    console.log('  - URL:', `/carrinho/itens/${itemId}`);
    console.log('  - ItemId:', itemId);
    
    try {
      const response = await api.delete(`/carrinho/itens/${itemId}`);
      console.log('✅ [cartService] Resposta recebida:', response);
      console.log('  - Status:', response.status);
      console.log('  - Data:', response.data);
      
      const cart = response.data.data || response.data;
      console.log('  - Carrinho processado:', cart);
      return cart;
    } catch (error: any) {
      console.error('❌ [cartService] Erro na requisição DELETE');
      console.error('  - Error:', error);
      console.error('  - Response:', error.response);
      console.error('  - Status:', error.response?.status);
      console.error('  - Data:', error.response?.data);
      throw error;
    }
  },

  async clear(): Promise<void> {
    console.log('📡 [cartService] Limpando carrinho');
    await api.delete('/carrinho/limpar');
    console.log('✅ [cartService] Carrinho limpo');
  },
};
