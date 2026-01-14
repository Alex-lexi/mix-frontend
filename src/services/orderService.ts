import api from './api';
import { Order, CreateOrderData, UpdateOrderStatusData } from '../types';

export const orderService = {
  async getAll(): Promise<Order[]> {
    const response = await api.get<Order[]>('/pedidos');
    return response.data;
  },

  async getById(id: number): Promise<Order> {
    const response = await api.get<Order>(`/pedidos/${id}`);
    return response.data;
  },

  async getByNumber(numero: string): Promise<Order> {
    const response = await api.get<Order>(`/pedidos/numero/${numero}`);
    return response.data;
  },

  async getByStatus(status: string): Promise<Order[]> {
    const response = await api.get<Order[]>(`/pedidos/status/${status}`);
    return response.data;
  },

  async create(data: CreateOrderData): Promise<Order> {
    const response = await api.post<Order>('/pedidos', data);
    return response.data;
  },

  async updateStatus(id: number, data: UpdateOrderStatusData): Promise<Order> {
    const response = await api.put<Order>(`/pedidos/${id}/status`, data);
    return response.data;
  },

  async cancel(id: number): Promise<void> {
    await api.delete(`/pedidos/${id}`);
  },
};
