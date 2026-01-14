import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ClientLayout } from '../../layouts/ClientLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { Star, ShoppingCart } from 'lucide-react';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useCart } from '../../contexts/CartContext';
import { Product, Category } from '../../types';

export function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast, showToast, hideToast } = useToast();

  // Filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || '');
  const [precoMin, setPrecoMin] = useState(searchParams.get('precoMin') || '');
  const [precoMax, setPrecoMax] = useState(searchParams.get('precoMax') || '');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (searchParams.get('q')) {
        filters.q = searchParams.get('q');
      }
      if (searchParams.get('categoria')) {
        filters.categoriaId = parseInt(searchParams.get('categoria')!);
      }
      if (searchParams.get('precoMin')) {
        filters.precoMin = parseFloat(searchParams.get('precoMin')!);
      }
      if (searchParams.get('precoMax')) {
        filters.precoMax = parseFloat(searchParams.get('precoMax')!);
      }

      const data = Object.keys(filters).length > 0
        ? await productService.advancedFilter(filters)
        : await productService.getAll();
      
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const params: any = {};
    if (searchTerm) params.q = searchTerm;
    if (selectedCategory) params.categoria = selectedCategory;
    if (precoMin) params.precoMin = precoMin;
    if (precoMax) params.precoMax = precoMax;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPrecoMin('');
    setPrecoMax('');
    setSearchParams({});
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart({ produtoId: productId, quantidade: 1 });
      showToast('Produto adicionado ao carrinho!', 'success');
    } catch (error) {
      showToast('Erro ao adicionar ao carrinho', 'error');
    }
  };

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Catálogo de Produtos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Filtros */}
          <aside className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Filtros</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Buscar</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nome do produto..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Todas</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Faixa de Preço</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={precoMin}
                      onChange={(e) => setPrecoMin(e.target.value)}
                      placeholder="Mín"
                      className="input-field"
                    />
                    <input
                      type="number"
                      value={precoMax}
                      onChange={(e) => setPrecoMax(e.target.value)}
                      placeholder="Máx"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Button onClick={handleApplyFilters} className="w-full">
                    Aplicar Filtros
                  </Button>
                  <Button onClick={handleClearFilters} variant="secondary" className="w-full">
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </Card>
          </aside>

          {/* Grid de Produtos */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <Card>
                <p className="text-center text-gray-500 py-8">
                  Nenhum produto encontrado com os filtros selecionados
                </p>
              </Card>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <Link to={`/produto/${product.id}`}>
                        {product.imagem ? (
                          <img
                            src={product.imagem}
                            alt={product.nome}
                            className="w-full h-48 object-cover rounded mb-4"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                            <span className="text-gray-400">Sem imagem</span>
                          </div>
                        )}
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {product.nome}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="text-yellow-400 fill-current"
                            size={14}
                          />
                        ))}
                      </div>

                      {product.categoria && (
                        <p className="text-sm text-gray-500 mb-2">{product.categoria.nome}</p>
                      )}

                      <p className="text-2xl font-bold text-primary-600 mb-3">
                        R$ {product.preco.toFixed(2)}
                      </p>

                      <div className="flex gap-2">
                        <Link to={`/produto/${product.id}`} className="flex-1">
                          <Button variant="secondary" className="w-full text-sm">
                            Ver Detalhes
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.quantidade === 0}
                          className="text-sm"
                        >
                          <ShoppingCart size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </ClientLayout>
  );
}
