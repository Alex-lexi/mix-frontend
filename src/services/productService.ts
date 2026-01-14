import api from './api';
import { Product, CreateProductData, ProductFilters } from '../types';

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/produtos');
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/produtos/${id}`);
    return response.data;
  },

  async search(nome: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/produtos/busca/search`, {
      params: { nome },
    });
    return response.data;
  },

  async globalSearch(q: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/produtos/buscar/global/search`, {
      params: { q },
    });
    return response.data;
  },

  async advancedFilter(filters: ProductFilters): Promise<Product[]> {
    const response = await api.get<Product[]>(`/produtos/filtrar/avancado/search`, {
      params: filters,
    });
    return response.data;
  },

  async getByCategory(categoryId: number): Promise<Product[]> {
    const response = await api.get<Product[]>(`/produtos/categoria/${categoryId}`);
    return response.data;
  },

  async getSimilar(id: number): Promise<Product[]> {
    const response = await api.get<Product[]>(`/produtos/similares/${id}`);
    return response.data;
  },

  async getBestsellers(): Promise<Product[]> {
    const response = await api.get<Product[]>(`/produtos/bestsellers/lista`);
    return response.data;
  },

  async create(data: CreateProductData): Promise<Product> {
    const response = await api.post<Product>('/produtos', data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateProductData>): Promise<Product> {
    const response = await api.put<Product>(`/produtos/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`);
  },
};
