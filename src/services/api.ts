import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      const data = error.response?.data as { code?: string } | undefined;
      const currentPath = window.location.pathname + window.location.search;
      const storedUser = localStorage.getItem('user');
      let userType: string | null = null;

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          userType = parsed?.tipo ?? null;
        } catch {
          userType = null;
        }
      }

      // Caso específico: token não fornecido (usuário não logado)
      if (data?.code === 'TOKEN_NAO_FORNECIDO') {
        const isAdminRoute = currentPath.startsWith('/admin');
        const loginPath = isAdminRoute ? '/admin/login' : '/login';
        const redirectParam = encodeURIComponent(currentPath);
        window.location.href = `${loginPath}?redirect=${redirectParam}`;
        return Promise.reject(error);
      }

      // Token inválido ou expirado: limpar sessão e redirecionar
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const isAdminUser = userType === 'admin' || userType === 'vendedor' || currentPath.startsWith('/admin');
      const loginPath = isAdminUser ? '/admin/login' : '/login';
      const redirectParam = encodeURIComponent(currentPath);
      window.location.href = `${loginPath}?redirect=${redirectParam}`;
    }

    return Promise.reject(error);
  }
);

console.log('API Base URL:', API_BASE_URL);

export default api;
