import api from './api';
import { Cart, AddToCartData, UpdateCartItemData } from '../types';

export const cartService = {
  async get(clienteId: string): Promise<Cart> {
    const response = await api.get(`/carrinho/${clienteId}`);
    return response.data.data || response.data;
  },

  async addItem(clienteId: string, data: AddToCartData): Promise<Cart> {
    const response = await api.post(`/carrinho/${clienteId}/adicionar`, data);
    return response.data.data || response.data;
  },

  async updateItem(clienteId: string, itemId: number, data: UpdateCartItemData): Promise<Cart> {
    const response = await api.put(`/carrinho/${clienteId}/atualizar/${itemId}`, data);
    return response.data.data || response.data;
  },

  async removeItem(clienteId: string, itemId: number): Promise<Cart> {
    const response = await api.delete(`/carrinho/${clienteId}/remover/${itemId}`);
    return response.data.data || response.data;
  },

  async clear(clienteId: string): Promise<void> {
    await api.delete(`/carrinho/${clienteId}/limpar`);
  },
};
