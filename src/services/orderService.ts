import api from './api';
import { Order, CreateOrderData, UpdateOrderStatusData } from '../types';

export const orderService = {
  async getAll(): Promise<Order[]> {
    const response = await api.get('/pedidos');
    return response.data.data || response.data;
  },

  async getById(id: number): Promise<Order> {
    const response = await api.get(`/pedidos/${id}`);
    return response.data.data || response.data;
  },

  async getByNumber(numero: string): Promise<Order> {
    const response = await api.get(`/pedidos/numero/${numero}`);
    return response.data.data || response.data;
  },

  async getByStatus(status: string): Promise<Order[]> {
    const response = await api.get(`/pedidos/status/${status}`);
    return response.data.data || response.data;
  },

  async create(data: CreateOrderData): Promise<Order> {
    const response = await api.post('/pedidos', data);
    return response.data.data || response.data;
  },

  async updateStatus(id: number, data: UpdateOrderStatusData): Promise<Order> {
    const response = await api.put(`/pedidos/${id}/status`, data);
    return response.data.data || response.data;
  },

  async cancel(id: number): Promise<void> {
    await api.delete(`/pedidos/${id}`);
  },
};
