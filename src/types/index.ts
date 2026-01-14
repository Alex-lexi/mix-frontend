// Tipos de Usuário
export interface User {
  id: number;
  email: string;
  nome: string;
  tipo: 'vendedor' | 'cliente';
  telefone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  email: string;
  senha: string;
  nome: string;
  tipo: 'vendedor' | 'cliente';
  telefone?: string;
}

// Tipos de Produto
export interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  imagem?: string;
  quantidade: number;
  categoriaId?: number;
  vendedorId: number;
  cor?: string;
  tamanho?: string;
  categoria?: Category;
  vendedor?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  nome: string;
  preco: number;
  descricao?: string;
  imagem?: string;
  quantidade: number;
  categoriaId?: number;
  cor?: string;
  tamanho?: string;
}

// Tipos de Categoria
export interface Category {
  id: number;
  nome: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  nome: string;
  descricao?: string;
}

// Tipos de Carrinho
export interface CartItem {
  id: number;
  carrinhoId: number;
  produtoId: number;
  quantidade: number;
  produto: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number;
  clienteId?: string;
  usuarioId?: number;
  itens: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  produtoId: number;
  quantidade: number;
}

export interface UpdateCartItemData {
  quantidade: number;
}

// Tipos de Pedido
export interface OrderItem {
  id: number;
  pedidoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  produto: Product;
}

export interface Order {
  id: number;
  numero: string;
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  total: number;
  usuarioId?: number;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  clienteEndereco: string;
  observacoes?: string;
  itens: OrderItem[];
  usuario?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  clienteEndereco: string;
  observacoes?: string;
  itens: {
    produtoId: number;
    quantidade: number;
    precoUnitario: number;
  }[];
}

export interface UpdateOrderStatusData {
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
}

// Tipos de Filtros
export interface ProductFilters {
  nome?: string;
  q?: string;
  precoMin?: number;
  precoMax?: number;
  cor?: string;
  tamanho?: string;
  categoriaId?: number;
}

// Tipos de Resposta da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Tipos de Erro
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
