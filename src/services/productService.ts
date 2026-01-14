import api from './api';
import { Product, CreateProductData, ProductFilters } from '../types';

export const productService = {
  async getAll(): Promise<Product[]> {
    console.log('🔍 Fetching all products...');
    try {
      const response = await api.get('/produtos');
      console.log('✅ Products received:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Product> {
    console.log('🔍 Fetching product by id:', id);
    const response = await api.get(`/produtos/${id}`);
    console.log('✅ Product received:', response.data);
    return response.data.data || response.data;
  },

  async search(nome: string): Promise<Product[]> {
    const response = await api.get(`/produtos/busca/search`, {
      params: { nome },
    });
    return response.data.data || response.data;
  },

  async globalSearch(q: string): Promise<Product[]> {
    const response = await api.get(`/produtos/buscar/global/search`, {
      params: { q },
    });
    return response.data.data || response.data;
  },

  async advancedFilter(filters: ProductFilters): Promise<Product[]> {
    console.log('🔍 Applying filters:', filters);
    try {
      const response = await api.get(`/produtos/filtrar/avancado/search`, {
        params: filters,
      });
      console.log('✅ Filtered products:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error filtering products:', error);
      throw error;
    }
  },

  async getByCategory(categoryId: number): Promise<Product[]> {
    const response = await api.get(`/produtos/categoria/${categoryId}`);
    return response.data.data || response.data;
  },

  async getSimilar(id: number): Promise<Product[]> {
    const response = await api.get(`/produtos/similares/${id}`);
    return response.data.data || response.data;
  },

  async getBestsellers(): Promise<Product[]> {
    console.log('🔍 Fetching bestsellers...');
    try {
      const response = await api.get(`/produtos/bestsellers/lista`);
      console.log('✅ Bestsellers received:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error fetching bestsellers:', error);
      throw error;
    }
  },

  async create(data: CreateProductData): Promise<Product> {
    const response = await api.post('/produtos', data);
    return response.data.data || response.data;
  },

  async update(id: number, data: Partial<CreateProductData>): Promise<Product> {
    const response = await api.put(`/produtos/${id}`, data);
    return response.data.data || response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`);
  },
};
