import api from './api';
import { User } from '../types';

interface VendorListResponse {
  success: boolean;
  total: number;
  data: User[];
  message?: string;
}

export const vendorService = {
  async list(): Promise<VendorListResponse> {
    const response = await api.get('/auth/vendedores');
    const data: VendorListResponse = response.data;

    if (!response.status || response.status < 200 || response.status >= 300) {
      throw new Error(data.message || 'Erro ao listar vendedores');
    }

    return data;
  },
};
