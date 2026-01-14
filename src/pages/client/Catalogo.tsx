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
  const [error, setError] = useState<string | null>(null);
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
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategories([]);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: any = {};
      
      const qParam = searchParams.get('q');
      const catParam = searchParams.get('categoria');
      const minParam = searchParams.get('precoMin');
      const maxParam = searchParams.get('precoMax');
      
      if (qParam) {
        filters.q = qParam;
      }
      if (catParam) {
        const catId = parseInt(catParam);
        if (!isNaN(catId)) {
          filters.categoriaId = catId;
        }
      }
      if (minParam) {
        const min = parseFloat(minParam);
        if (!isNaN(min)) {
          filters.precoMin = min;
        }
      }
      if (maxParam) {
        const max = parseFloat(maxParam);
        if (!isNaN(max)) {
          filters.precoMax = max;
        }
      }

      const data = Object.keys(filters).length > 0
        ? await productService.advancedFilter(filters)
        : await productService.getAll();
      
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar produtos. Tente novamente.');
      setProducts([]);
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
        <h1 className="text-4xl font-bold mb-8 text-white">Catálogo de Produtos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Filtros */}
          <aside className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-pink-400">Filtros</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Buscar</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nome do produto..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Todas</option>
                    {categories && categories.length > 0 && categories.map((cat) => (
                      <option key={cat.id} value={cat.id?.toString() || ''}>
                        {cat.nome || 'Sem nome'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Faixa de Preço</label>
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
            ) : error ? (
              <Card>
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button onClick={() => loadProducts()}>
                    Tentar Novamente
                  </Button>
                </div>
              </Card>
            ) : products.length === 0 ? (
              <Card>
                <p className="text-center text-gray-400 py-8">
                  Nenhum produto encontrado com os filtros selecionados
                </p>
              </Card>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    if (!product || !product.id) return null;
                    
                    return (
                      <Card key={product.id} className="hover:scale-105 transition-all overflow-hidden group">
                        <Link to={`/produto/${product.id}`}>
                          {product.imagem ? (
                            <div className="relative overflow-hidden">
                              <img
                                src={product.imagem}
                                alt={product.nome}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              {product.quantidade <= 0 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                                    Esgotado
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                              <span className="text-gray-500">Sem imagem</span>
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white group-hover:text-pink-400 transition-colors">
                              {product.nome}
                            </h3>
                          </div>
                        </Link>
                        
                        <div className="px-4">
                          <div className="flex items-center mb-2 gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="text-yellow-400 fill-current"
                                size={14}
                              />
                            ))}
                          </div>

                          {product.categoria && product.categoria.nome && (
                            <p className="text-sm text-gray-400 mb-2">{product.categoria.nome}</p>
                          )}

                          <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
                            R$ {(product.preco || 0).toFixed(2)}
                          </p>

                          <div className="flex gap-2 pb-4">
                            <Link to={`/produto/${product.id}`} className="flex-1">
                              <Button variant="secondary" className="w-full text-sm">
                                Ver Detalhes
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleAddToCart(product.id)}
                              disabled={!product.quantidade || product.quantidade === 0}
                              className="text-sm"
                              title="Adicionar ao carrinho"
                            >
                              <ShoppingCart size={16} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={hideToast} />}
    </ClientLayout>
  );
}
