# 🚀 Guia Rápido de Início - MixStore Frontend

## Pré-requisitos
- ✅ Node.js 18+ instalado
- ✅ Backend rodando em http://localhost:3000
- ✅ Banco de dados do backend configurado

## Instalação em 3 Passos

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

### 3️⃣ Acessar a Aplicação
- **Client App**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login

## 🎯 Primeiros Passos

### Para Testar o Admin Panel

1. **Criar usuário vendedor** (via Postman/Insomnia/cURL):
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "senha": "senha123",
    "nome": "Admin Teste",
    "tipo": "vendedor",
    "telefone": "(11) 99999-9999"
  }'
```

2. **Fazer login**:
   - Acesse: http://localhost:5173/admin/login
   - Email: admin@test.com
   - Senha: senha123

3. **Criar dados de teste**:
   - Criar 2-3 categorias
   - Criar 5-10 produtos

### Para Testar o Client App

1. **Acessar a home**:
   - Vá para: http://localhost:5173

2. **Explorar produtos**:
   - Navegue pelo catálogo
   - Use os filtros
   - Veja detalhes dos produtos

3. **Fazer uma compra**:
   - Adicione produtos ao carrinho
   - Vá para o checkout
   - Preencha os dados de entrega
   - Confirme o pedido
   - Copie o número do pedido

4. **Rastrear o pedido**:
   - Vá para "Rastrear Pedido"
   - Cole o número do pedido
   - Veja o status

## 🔧 Configuração Avançada

### Alterar URL da API

Se seu backend estiver em outra porta/endereço:

1. Abra `src/services/api.ts`
2. Altere a linha:
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Limpar Dados do Navegador

Se precisar resetar o carrinho ou fazer novo login:

1. Abra o Console do navegador (F12)
2. Digite:
```javascript
localStorage.clear()
```
3. Recarregue a página (F5)

## 📝 Comandos Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Visualizar build de produção
npm run preview

# Executar linting
npm run lint
```

## 🐛 Problemas Comuns

### Erro de CORS
**Problema**: Erro de CORS no console
**Solução**: Verifique se o backend está com CORS habilitado para http://localhost:5173

### Backend não responde
**Problema**: Erro ao conectar com API
**Solução**: Confirme que o backend está rodando em http://localhost:3000

### Carrinho vazio após recarregar
**Problema**: Carrinho perde os dados
**Solução**: Isso é normal. O carrinho é vinculado ao clienteId no localStorage. Se limpar o localStorage, o carrinho é perdido.

### Token expirado
**Problema**: Redirecionado para login automaticamente
**Solução**: O token JWT expira em 7 dias. Faça login novamente.

## 📚 Documentação Adicional

- `DOCUMENTATION.md` - Documentação completa
- `TESTING.md` - Guia de testes e dados de exemplo

## ✅ Verificação Rápida

Para verificar se tudo está funcionando:

1. [ ] npm run dev inicia sem erros
2. [ ] http://localhost:5173 abre a home
3. [ ] http://localhost:5173/admin/login abre o login
4. [ ] Consegue fazer login no admin
5. [ ] Consegue criar uma categoria
6. [ ] Consegue criar um produto
7. [ ] Produto aparece na home do cliente
8. [ ] Consegue adicionar ao carrinho
9. [ ] Consegue finalizar uma compra
10. [ ] Consegue rastrear o pedido

## 🎉 Pronto!

Se todos os itens acima estão funcionando, sua aplicação está pronta para uso!

Para desenvolvimento:
- Explore o código em `src/`
- Veja os componentes em `src/components/`
- Customize os estilos em `src/index.css`
- Ajuste as cores em `tailwind.config.js`

**Dúvidas?** Consulte a documentação completa em `DOCUMENTATION.md`
