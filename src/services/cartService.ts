import api from './api';
import { Cart, AddToCartData, UpdateCartItemData } from '../types';

export const cartService = {
  async get(clienteId: string): Promise<Cart> {
    const response = await api.get<Cart>(`/carrinho/${clienteId}`);
    return response.data;
  },

  async addItem(clienteId: string, data: AddToCartData): Promise<Cart> {
    const response = await api.post<Cart>(`/carrinho/${clienteId}/adicionar`, data);
    return response.data;
  },

  async updateItem(clienteId: string, itemId: number, data: UpdateCartItemData): Promise<Cart> {
    const response = await api.put<Cart>(`/carrinho/${clienteId}/atualizar/${itemId}`, data);
    return response.data;
  },

  async removeItem(clienteId: string, itemId: number): Promise<Cart> {
    const response = await api.delete<Cart>(`/carrinho/${clienteId}/remover/${itemId}`);
    return response.data;
  },

  async clear(clienteId: string): Promise<void> {
    await api.delete(`/carrinho/${clienteId}/limpar`);
  },
};
