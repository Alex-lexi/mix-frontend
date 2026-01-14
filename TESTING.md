# Dados de Teste - MixStore

## Usuários para Teste

### Vendedor
```json
{
  "email": "vendedor@mixstore.com",
  "senha": "senha123",
  "nome": "João Vendedor",
  "tipo": "vendedor",
  "telefone": "(11) 98765-4321"
}
```

### Cliente
```json
{
  "email": "cliente@mixstore.com",
  "senha": "senha123",
  "nome": "Maria Cliente",
  "tipo": "cliente",
  "telefone": "(11) 91234-5678"
}
```

## Categorias de Exemplo

```json
[
  {
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos e gadgets"
  },
  {
    "nome": "Roupas",
    "descricao": "Vestuário masculino e feminino"
  },
  {
    "nome": "Livros",
    "descricao": "Livros físicos e digitais"
  },
  {
    "nome": "Casa e Decoração",
    "descricao": "Itens para casa e decoração"
  }
]
```

## Produtos de Exemplo

```json
[
  {
    "nome": "Smartphone XYZ",
    "preco": 1999.99,
    "descricao": "Smartphone com 128GB de armazenamento",
    "imagem": "https://via.placeholder.com/400",
    "quantidade": 50,
    "categoriaId": 1,
    "cor": "Preto",
    "tamanho": "6.5 polegadas"
  },
  {
    "nome": "Camiseta Básica",
    "preco": 49.90,
    "descricao": "Camiseta 100% algodão",
    "imagem": "https://via.placeholder.com/400",
    "quantidade": 100,
    "categoriaId": 2,
    "cor": "Branca",
    "tamanho": "M"
  },
  {
    "nome": "Livro de Ficção",
    "preco": 39.90,
    "descricao": "Best-seller de ficção científica",
    "imagem": "https://via.placeholder.com/400",
    "quantidade": 30,
    "categoriaId": 3
  }
]
```

## URLs de Imagens Gratuitas para Testes

- **Placeholder**: `https://via.placeholder.com/400`
- **Unsplash**: `https://source.unsplash.com/400x400/?product`
- **Picsum**: `https://picsum.photos/400`

## Fluxo de Teste Completo

### 1. Teste Admin Panel

1. Registre um usuário vendedor via Postman/Insomnia:
   ```
   POST http://localhost:3000/api/auth/register
   Body: { "email": "vendedor@test.com", "senha": "senha123", "nome": "Vendedor", "tipo": "vendedor" }
   ```

2. Faça login no Admin:
   - Acesse: http://localhost:5173/admin/login
   - Email: vendedor@test.com
   - Senha: senha123

3. Crie categorias:
   - Vá para "Categorias"
   - Adicione as categorias de exemplo

4. Crie produtos:
   - Vá para "Produtos"
   - Adicione produtos vinculados às categorias

### 2. Teste Client App

1. Acesse a home: http://localhost:5173

2. Navegue pelo catálogo:
   - Clique em "Produtos"
   - Use os filtros (categoria, preço)
   - Busque por nome

3. Veja detalhes:
   - Clique em um produto
   - Altere a quantidade
   - Adicione ao carrinho

4. Carrinho:
   - Veja o ícone do carrinho atualizado
   - Acesse o carrinho
   - Altere quantidades
   - Remova itens

5. Checkout:
   - Preencha os dados:
     - Nome: João Silva
     - Email: joao@email.com
     - Telefone: (11) 99999-9999
     - Endereço: Rua Teste, 123, São Paulo, SP, 01234-567
   - Confirme o pedido
   - Copie o número do pedido

6. Rastreamento:
   - Acesse "Rastrear Pedido"
   - Cole o número do pedido
   - Veja o status

### 3. Teste Gerenciamento de Pedidos (Admin)

1. Volte ao Admin Panel

2. Acesse "Pedidos"

3. Veja o pedido criado

4. Clique em "Ver detalhes"

5. Atualize o status:
   - Pendente → Processando
   - Processando → Enviado
   - Enviado → Entregue

6. Volte ao rastreamento no Client App e veja as mudanças

## Comandos Úteis

### Limpar localStorage (console do navegador)
```javascript
localStorage.clear()
```

### Verificar clientId
```javascript
console.log(localStorage.getItem('clienteId'))
```

### Verificar token
```javascript
console.log(localStorage.getItem('token'))
```

### Verificar dados do usuário
```javascript
console.log(JSON.parse(localStorage.getItem('user')))
```

## Checklist de Funcionalidades

### Admin Panel
- [ ] Login funciona
- [ ] Dashboard mostra estatísticas corretas
- [ ] Criar categoria
- [ ] Editar categoria
- [ ] Deletar categoria
- [ ] Criar produto
- [ ] Editar produto
- [ ] Deletar produto
- [ ] Buscar produtos
- [ ] Ver lista de pedidos
- [ ] Filtrar pedidos por status
- [ ] Ver detalhes do pedido
- [ ] Atualizar status do pedido
- [ ] Cancelar pedido
- [ ] Editar perfil
- [ ] Logout funciona

### Client App
- [ ] Home carrega produtos em destaque
- [ ] Home mostra categorias
- [ ] Catálogo lista todos os produtos
- [ ] Filtro por categoria funciona
- [ ] Filtro por preço funciona
- [ ] Busca por nome funciona
- [ ] Detalhe do produto mostra informações corretas
- [ ] Produtos similares aparecem
- [ ] Adicionar ao carrinho funciona
- [ ] Ícone do carrinho atualiza quantidade
- [ ] Carrinho lista itens corretamente
- [ ] Alterar quantidade no carrinho funciona
- [ ] Remover item do carrinho funciona
- [ ] Limpar carrinho funciona
- [ ] Checkout valida campos obrigatórios
- [ ] Criar pedido funciona
- [ ] Número do pedido é exibido
- [ ] Rastreamento encontra pedido
- [ ] Status do pedido é exibido corretamente
- [ ] Timeline de status funciona
