# MixStore - Frontend E-commerce

Frontend completo para e-commerce desenvolvido com React, TypeScript e TailwindCSS.

## 🚀 Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server rápido
- **TailwindCSS** - Framework CSS utilitário
- **React Router** - Roteamento da aplicação
- **Axios** - Cliente HTTP para comunicação com API
- **Lucide React** - Biblioteca de ícones
- **Recharts** - Biblioteca de gráficos

## 📦 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
├── contexts/          # Contexts do React
├── hooks/             # Custom hooks
├── layouts/           # Layouts de página
├── pages/             # Páginas da aplicação
│   ├── admin/         # Admin Panel
│   └── client/        # Client App
├── services/          # Serviços de API
├── types/             # Tipos TypeScript
├── App.tsx            # Componente principal
└── main.tsx           # Entry point
```

## 🎯 Funcionalidades

### Admin Panel (Vendedores)
- ✅ Login/Autenticação com JWT
- ✅ Dashboard com estatísticas
- ✅ CRUD de Categorias
- ✅ CRUD de Produtos
- ✅ Gerenciamento de Pedidos
- ✅ Perfil do vendedor

### Client App (Clientes)
- ✅ Home com destaques
- ✅ Catálogo com filtros avançados
- ✅ Detalhe do Produto
- ✅ Carrinho de Compras
- ✅ Checkout
- ✅ Rastreamento de Pedidos

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure a URL da API em `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Aplicação disponível em: `http://localhost:5173`

## 📱 Rotas

### Públicas (Client)
- `/` - Home
- `/produtos` - Catálogo
- `/produto/:id` - Detalhe
- `/carrinho` - Carrinho
- `/checkout` - Checkout
- `/rastreamento` - Rastrear pedido

### Administrativas (Protegidas)
- `/admin/login` - Login
- `/admin/dashboard` - Dashboard
- `/admin/categorias` - Categorias
- `/admin/produtos` - Produtos
- `/admin/pedidos` - Pedidos
- `/admin/perfil` - Perfil

## 🔐 Autenticação

- JWT armazenado no localStorage
- Validade de 7 dias
- Redirecionamento automático ao expirar

## 🛒 Carrinho

- ClientId único (UUID) gerado automaticamente
- Persistência no localStorage
- Suporte a usuários anônimos

## 📝 Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Linting
```

## 🤝 Como Usar

### Como Vendedor:
1. Acesse `/admin/login`
2. Faça login
3. Gerencie produtos, categorias e pedidos

### Como Cliente:
1. Navegue pelos produtos
2. Adicione ao carrinho
3. Finalize a compra
4. Rastreie o pedido

Desenvolvido como parte do sistema de e-commerce completo.
