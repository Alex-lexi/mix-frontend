import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast, showToast, hideToast } = useToast();

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtro local de produtos
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por categoria
    if (selectedCategoryId) {
      filtered = filtered.filter(product => product.categoriaId === selectedCategoryId);
    }

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.nome.toLowerCase().includes(search) ||
        product.descricao?.toLowerCase().includes(search) ||
        product.cor?.toLowerCase().includes(search) ||
        product.tamanho?.toLowerCase().includes(search)
      );
    }

    // Filtrar por preço mínimo
    if (precoMin && !isNaN(parseFloat(precoMin))) {
      filtered = filtered.filter(product => product.preco >= parseFloat(precoMin));
    }

    // Filtrar por preço máximo
    if (precoMax && !isNaN(parseFloat(precoMax))) {
      filtered = filtered.filter(product => product.preco <= parseFloat(precoMax));
    }

    return filtered;
  }, [products, selectedCategoryId, searchTerm, precoMin, precoMax]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategoryId(null);
    setPrecoMin('');
    setPrecoMax('');
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart({ produtoId: productId, quantidade: 1 });
      showToast('Produto adicionado ao carrinho!', 'success');
    } catch {
      showToast('Erro ao adicionar ao carrinho', 'error');
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <Loading fullScreen />
      </ClientLayout>
    );
  }

  return (
    <ClientLayout onSearch={setSearchTerm}>
      {/* Categorias como Abas Horizontais */}
      {categories.length > 0 && (
        <div className="sticky top-20 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4 py-3">
              {/* Abas de Categorias */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`
                    flex-shrink-0 px-6 py-2.5 rounded-full font-semibold text-sm
                    transition-all duration-200 whitespace-nowrap
                    ${selectedCategoryId === null
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  Produtos
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`
                      flex-shrink-0 px-6 py-2.5 rounded-full font-semibold text-sm
                      transition-all duration-200 whitespace-nowrap
                      ${selectedCategoryId === category.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    {category.nome}
                  </button>
                ))}
              </div>

              {/* Filtros de Preço */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <input
                  type="number"
                  value={precoMin}
                  onChange={(e) => setPrecoMin(e.target.value)}
                  placeholder="Preço mín"
                  className="w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                />
                <input
                  type="number"
                  value={precoMax}
                  onChange={(e) => setPrecoMax(e.target.value)}
                  placeholder="Preço máx"
                  className="w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catálogo de Produtos */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Catálogo de Produtos</h1>
          <p className="text-gray-400">
            {filteredProducts.length} produto(s) encontrado(s)
            {selectedCategoryId && ` em ${categories.find(c => c.id === selectedCategoryId)?.nome}`}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {error ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => loadData()}>
                Tentar Novamente
              </Button>
            </div>
          </Card>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              Nenhum produto encontrado com os filtros aplicados
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              if (!product || !product.id) return null;
              
              return (
                <Card key={product.id} className="hover:scale-105 transition-all overflow-hidden group">
                  <Link to={`/produto/${product.id}`}>
                    {product.imagem ? (
                      <div className="relative overflow-hidden">
                        <img
                          src={product.imagem}
                          alt={product.nome}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
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
                      <div className="w-full h-56 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-gray-500">Sem imagem</span>
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/produto/${product.id}`}>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white group-hover:text-pink-400 transition-colors">
                        {product.nome}
                      </h3>
                    </Link>
                    
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

                    <div className="flex gap-2">
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
        )}
      </div>

      {toast && <Toast {...toast} onClose={hideToast} />}
    </ClientLayout>
  );
}
