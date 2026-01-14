# Guia de Testes - Admin Functionality

## Teste Rápido de Funcionalidades

### 1. Login e Autenticação

**Teste 1.1: Login do Admin**
```
1. Navegue para http://localhost:5173/admin/login
2. Insira credenciais válidas de admin:
   - Email: admin@email.com
   - Senha: senha123
3. Clique em "Entrar"
4. Esperado: Redireciona para Dashboard
5. Verificar: Token salvo em localStorage
```

**Teste 1.2: Verificar Token em localStorage**
```
1. Abra DevTools (F12)
2. Acesse Application > Local Storage
3. Procure por "token"
4. Esperado: Token JWT válido presente
5. Procure por "user"
6. Esperado: Objeto JSON com dados do usuário (id, email, nome, tipo)
```

---

### 2. Dashboard

**Teste 2.1: Carregamento do Dashboard**
```
1. Após login de admin, deve estar em /admin/dashboard
2. Esperado: Página carrega com:
   - Bem-vindo personalizado
   - 3 cards de acesso rápido (Produtos, Categorias, Pedidos)
   - 4 cards de estatísticas
   - Tabela de últimos pedidos
3. Clique em cada card de acesso rápido
4. Esperado: Navega para página correspondente
```

**Teste 2.2: Estatísticas**
```
1. Verifique cards de estatísticas:
   - Total de Vendas (somando todos os pedidos)
   - Número de Pedidos
   - Número de Produtos
   - Taxa de Conversão (pedidos / produtos * 100)
2. Esperado: Valores coerentes com base de dados
```

---

### 3. Gerenciamento de Categorias

**Teste 3.1: Criar Categoria**
```
1. Clique em "Gerenciar Categorias" no menu
2. Clique no botão "Nova Categoria"
3. Modal abre com campos vazios
4. Preencha:
   - Nome: "Test Category"
   - Descrição: "Test Description"
5. Clique em "Criar"
6. Esperado: 
   - Toast de sucesso
   - Modal fecha
   - Nova categoria aparece na tabela
   - DevTools mostra POST para /api/categorias
```

**Teste 3.2: Editar Categoria**
```
1. Clique no ícone de edição de uma categoria
2. Modal abre com dados preenchidos
3. Altere o nome para "Updated Category"
4. Clique em "Salvar"
5. Esperado:
   - Toast de sucesso
   - Tabela atualiza com novo nome
   - DevTools mostra PUT para /api/categorias/:id
```

**Teste 3.3: Deletar Categoria**
```
1. Clique no ícone de lixeira de uma categoria
2. Janela de confirmação aparece
3. Confirme deletion
4. Esperado:
   - Toast de sucesso
   - Categoria desaparece da tabela
   - DevTools mostra DELETE para /api/categorias/:id
```

---

### 4. Gerenciamento de Produtos

**Teste 4.1: Criar Produto**
```
1. Clique em "Gerenciar Produtos" no menu
2. Clique no botão "Novo Produto"
3. Modal abre para criação
4. Preencha todos os campos:
   - Nome: "Test Product"
   - Preço: 99.90
   - Quantidade: 10
   - Descrição: "Test Description"
   - Imagem: url válida (ou deixe vazio)
   - Categoria: Selecione uma
   - Cor: Azul
   - Tamanho: M
5. Clique em "Criar"
6. Esperado:
   - Toast de sucesso
   - Produto aparece na tabela
   - Imagem exibida corretamente
```

**Teste 4.2: Filtrar Produtos**
```
1. Na tabela de produtos, use a barra de busca
2. Digite parte do nome de um produto
3. Esperado: Tabela filtra em tempo real, mostrando apenas produtos que correspondem
```

**Teste 4.3: Gerenciar Promoção**
```
1. Na tabela de produtos, clique no ícone de tag (promoção)
2. Modal de promoção abre
3. Clique em "Ativar Promoção"
4. Preencha:
   - Preço Promocional: 79.90 (menor que preço normal)
5. Verificar cálculo de desconto:
   - Desconto %: ~20%
   - Economia: ~R$ 20.00
6. Clique em "Ativar Promoção"
7. Esperado:
   - Toast de sucesso
   - Tabela mostra "Em Promoção" na coluna de promoção
   - Preço original com linha de corte, preço promocional em verde
   - DevTools mostra PUT para /api/produtos/:id/promocao
```

**Teste 4.4: Validação de Preço Promocional**
```
1. Abra modal de promoção de um produto
2. Tente definir preço promocional maior que preço normal
3. Esperado: Aviso em vermelho: "O preço promocional deve ser menor que o preço normal"
4. Botão "Ativar Promoção" deve estar desabilitado
```

---

### 5. Gerenciamento de Pedidos

**Teste 5.1: Listar Pedidos**
```
1. Clique em "Pedidos" no menu
2. Esperado: Tabela carrega com:
   - Número do pedido (#PED-001, etc)
   - Nome e email do cliente
   - Status com badge colorido
   - Total em reais
   - Data de criação
```

**Teste 5.2: Filtrar por Status**
```
1. Use o select "Filtrar por status"
2. Selecione "Pendente"
3. Esperado: Tabela filtra para mostrar apenas pedidos pendentes
4. Repita para outros status: Processando, Enviado, Entregue, Cancelado
```

**Teste 5.3: Ver Detalhes do Pedido**
```
1. Clique no ícone de olho de um pedido
2. Modal abre com detalhes:
   - Nome, email, telefone do cliente
   - Endereço de entrega
   - Observações (se houver)
   - Itens do pedido com quantidades e preços
   - Total do pedido
3. Verificar cálculo: Soma dos itens = Total
```

**Teste 5.4: Atualizar Status do Pedido**
```
1. Abra modal de detalhes de um pedido
2. Na seção "Atualizar Status", veja botões dos status
3. Botão do status atual deve estar desabilitado
4. Clique em um novo status (ex: "processando")
5. Esperado:
   - Toast de sucesso
   - Status na tabela atualiza
   - Modal atualiza o pedido
   - DevTools mostra PUT para /api/pedidos/:id/status
```

**Teste 5.5: Cancelar Pedido**
```
1. Abra modal de detalhes de um pedido ativo
2. Clique no botão "Cancelar Pedido"
3. Janela de confirmação aparece
4. Confirme
5. Esperado:
   - Toast de sucesso
   - Modal fecha
   - Pedido desaparece da tabela (ou muda para "cancelado")
   - DevTools mostra DELETE para /api/pedidos/:id
```

---

### 6. Menu de Navegação

**Teste 6.1: Visibilidade de Menu (Admin)**
```
1. Login como admin
2. Abra o menu sidebar
3. Esperado: Vê todos os itens:
   - Dashboard
   - Vendedores (admin only)
   - Produtos
   - Categorias
   - Pedidos
   - Perfil
   - Sair
```

**Teste 6.2: Visibilidade de Menu (Vendedor)**
```
1. Login como vendedor
2. Abra o menu sidebar
3. Esperado: NÃO vê "Vendedores"
4. Vê:
   - Dashboard
   - Produtos
   - Categorias
   - Pedidos
   - Perfil
   - Sair
```

**Teste 6.3: Indicador de Página Ativa**
```
1. Navegue entre páginas
2. Esperado: Item do menu atual tem background colorido (pink/purple gradient)
3. Outros itens têm estilo normal
```

---

### 7. Segurança e Proteção

**Teste 7.1: Acesso sem Token**
```
1. Abra DevTools e delete localStorage (token e user)
2. Tente acessar /admin/dashboard
3. Esperado: Redireciona para /login
```

**Teste 7.2: Acesso com Token Expirado**
```
1. (Simular no DevTools) Edite o token JWT para uma data expirada
2. Tente fazer uma ação (criar, editar, deletar)
3. Esperado: Erro 401 e redireciona para /admin/login
4. localStorage é limpo
```

**Teste 7.3: Vendedor não acessa Vendedores**
```
1. Login como vendedor
2. Tente acessar /admin/vendedores manualmente
3. Esperado: Redireciona para /admin/dashboard
```

---

### 8. Responsividade

**Teste 8.1: Desktop (1920px)**
```
1. Abra a aplicação em tela cheia
2. Esperado: Layout com sidebar + conteúdo lado a lado
3. Tabelas sem scroll horizontal
4. Grids com múltiplas colunas
```

**Teste 8.2: Tablet (768px)**
```
1. Use DevTools para simular tablet
2. Esperado: Grid muda para 2 colunas (md:)
3. Sidebar permanece visível
```

**Teste 8.3: Mobile (375px)**
```
1. Use DevTools para simular mobile
2. Esperado: Grid muda para 1 coluna
3. Tabelas rolam horizontalmente
```

---

### 9. Feedback Visual

**Teste 9.1: Toast Notifications**
```
1. Crie uma categoria
2. Esperado: Toast verde com "Categoria criada com sucesso!" aparece
3. Tente deletar algo e confirme
4. Esperado: Toast verde com sucesso
5. Tente um erro (ex: preço promocional errado)
6. Esperado: Toast vermelho com mensagem de erro
```

**Teste 9.2: Estados de Loading**
```
1. Abra a página de produtos
2. Esperado: Spinner de carregamento enquanto busca dados
3. Depois exibe tabela
```

**Teste 9.3: Hover Effects**
```
1. Passe mouse sobre:
   - Linhas de tabela: Background muda
   - Botões: Cor muda
   - Ícones: Cor muda
2. Esperado: Visual feedback imediato
```

---

## Checklist Completo

### Funcionalidades
- [ ] Dashboard carrega com estatísticas corretas
- [ ] Criar categoria funciona
- [ ] Editar categoria funciona
- [ ] Deletar categoria funciona
- [ ] Criar produto funciona
- [ ] Editar produto funciona
- [ ] Deletar produto funciona
- [ ] Ativar/desativar promoção funciona
- [ ] Filtrar produtos por nome funciona
- [ ] Listar pedidos funciona
- [ ] Filtrar pedidos por status funciona
- [ ] Ver detalhes do pedido funciona
- [ ] Atualizar status do pedido funciona
- [ ] Cancelar pedido funciona
- [ ] Menu de navegação funciona
- [ ] Toast notifications funcionam

### Segurança
- [ ] Token é salvo em localStorage
- [ ] Token é enviado em requisições
- [ ] Acesso sem token redireciona
- [ ] Token expirado redireciona
- [ ] Vendedor não acessa Vendedores

### UI/UX
- [ ] Layout responsivo
- [ ] Hover effects funcionam
- [ ] Cores e estilos corretos
- [ ] Ícones exibem corretamente
- [ ] Tabelas rolam em mobile
- [ ] Modais funcionam corretamente

### Dados
- [ ] Estatísticas são precisas
- [ ] Preços calculados corretamente
- [ ] Descontos calculados corretamente
- [ ] Totais somam corretamente
- [ ] Datas formatadas em pt-BR

---

## Troubleshooting

### Erro 401 ou 403 ao fazer ações
- Verifique se está logado como admin ou vendedor
- Verifique se o token não expirou
- Verifique no DevTools > Network se Authorization header está correto

### Tabelas vazias
- Verifique se há dados no backend
- Verifique console (F12) para erros de API
- Verifique variável VITE_API_URL

### Toast notifications não aparecem
- Verifique se o componente Toast está renderizado
- Verifique browser console para erros

### Promoção não salva
- Verifique se preço promocional < preço normal
- Verifique se Backend retorna 200/201
- Verifique Network tab para resposta da API

---

**Último atualizado**: 14 de janeiro de 2026
