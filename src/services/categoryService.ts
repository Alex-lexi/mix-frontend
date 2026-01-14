import api from './api';
import { Category, CreateCategoryData } from '../types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categorias');
    return response.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await api.get<Category>(`/categorias/${id}`);
    return response.data;
  },

  async create(data: CreateCategoryData): Promise<Category> {
    const response = await api.post<Category>('/categorias', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateCategoryData>): Promise<Category> {
    const response = await api.put<Category>(`/categorias/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`);
  },
};
