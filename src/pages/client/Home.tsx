import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ClientLayout } from '../../layouts/ClientLayout';
import { Card } from '../../components/Card';
import { Loading } from '../../components/Loading';
import { Star, ShoppingCart, Sparkles, TrendingUp, Tag, ChevronDown } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../hooks/useToast';
import { Product, Category } from '../../types';

type FilterType = 'all' | 'novidades' | 'promocoes' | 'mais-vendidos';

export function Home() {
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [mostSoldProducts, setMostSoldProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        allProductsData,
        categoriesData,
        mostSoldData,
        newData,
        promotionData,
      ] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        productService.getMostSold(20).catch(() => []),
        productService.getNew(20, 30).catch(() => []),
        productService.getPromotions(20).catch(() => []),
      ]);
      const products = Array.isArray(allProductsData) ? allProductsData : [];
      const cats = Array.isArray(categoriesData) ? categoriesData : [];
      setAllProducts(products);
      setCategories(cats);
      setMostSoldProducts(Array.isArray(mostSoldData) ? mostSoldData : []);
      setNewProducts(Array.isArray(newData) ? newData : []);
      setPromotionProducts(Array.isArray(promotionData) ? promotionData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setAllProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtro local de produtos por categoria e busca
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Aplicar filtro de tipo (novidades, promoções, mais vendidos)
    if (selectedFilter === 'novidades') {
      filtered = newProducts;
    } else if (selectedFilter === 'promocoes') {
      filtered = promotionProducts;
    } else if (selectedFilter === 'mais-vendidos') {
      filtered = mostSoldProducts;
    }

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

    return filtered;
  }, [allProducts, mostSoldProducts, newProducts, promotionProducts, selectedFilter, selectedCategoryId, searchTerm]);

  const handleAddToCart = (product: Product) => {
    addItem(product.id, 1);
    showToast(`${product.nome} adicionado ao carrinho!`, 'success');
  };

  const getPreco = (product: Product) => {
    if (product.emPromocao && product.precoPromocional) {
      return {
        atual: product.precoPromocional,
        original: product.preco,
        desconto: Math.round(((product.preco - product.precoPromocional) / product.preco) * 100),
      };
    }
    return { atual: product.preco };
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
      {/* Barra de Navegação - Filtros */}
      <div className="sticky top-20 z-30 bg-[#1a0b2e] border-b border-pink-500/20 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-4">
            {/* Filtros de Tipo */}
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => {
                  setSelectedFilter('all');
                  setSelectedCategoryId(null);
                }}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50'
                    : 'bg-[#2d1b4e] text-gray-300 hover:bg-[#3d2b5e] hover:text-white'
                }`}
              >
                Todos os Produtos
              </button>
              
              <button
                onClick={() => {
                  setSelectedFilter('novidades');
                  setSelectedCategoryId(null);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === 'novidades'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50'
                    : 'bg-[#2d1b4e] text-gray-300 hover:bg-[#3d2b5e] hover:text-white'
                }`}
              >
                <Sparkles size={16} />
                Novidades ({newProducts.length})
              </button>

              <button
                onClick={() => {
                  setSelectedFilter('promocoes');
                  setSelectedCategoryId(null);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === 'promocoes'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50'
                    : 'bg-[#2d1b4e] text-gray-300 hover:bg-[#3d2b5e] hover:text-white'
                }`}
              >
                <Tag size={16} />
                Promoções ({promotionProducts.length})
              </button>

              <button
                onClick={() => {
                  setSelectedFilter('mais-vendidos');
                  setSelectedCategoryId(null);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap cursor-pointer ${
                  selectedFilter === 'mais-vendidos'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50'
                    : 'bg-[#2d1b4e] text-gray-300 hover:bg-[#3d2b5e] hover:text-white'
                }`}
              >
                <TrendingUp size={16} />
                Mais Vendidos ({mostSoldProducts.length})
              </button>
            </div>

            {/* Dropdown de Categorias */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm bg-[#2d1b4e] text-gray-300 hover:bg-[#3d2b5e] hover:text-white transition-all whitespace-nowrap cursor-pointer"
              >
                {selectedCategoryId 
                  ? categories.find(c => c.id === selectedCategoryId)?.nome 
                  : 'Todas Categorias'}
                <ChevronDown size={16} className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[#2d1b4e] border border-pink-500/20 rounded-lg shadow-2xl overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer ${
                      selectedCategoryId === null
                        ? 'bg-pink-500/20 text-pink-400 font-semibold'
                        : 'text-gray-300 hover:bg-[#3d2b5e] hover:text-white'
                    }`}
                  >
                    Todas Categorias
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer ${
                        selectedCategoryId === category.id
                          ? 'bg-pink-500/20 text-pink-400 font-semibold'
                          : 'text-gray-300 hover:bg-[#3d2b5e] hover:text-white'
                      }`}
                    >
                      {category.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo de Produtos */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            {selectedFilter === 'novidades' && '✨ Novidades'}
            {selectedFilter === 'promocoes' && '🔥 Promoções'}
            {selectedFilter === 'mais-vendidos' && '⭐ Mais Vendidos'}
            {selectedFilter === 'all' && 'Catálogo de Produtos'}
          </h1>
          <p className="text-gray-400">
            {filteredProducts.length} produto(s) encontrado(s)
            {selectedCategoryId && ` em ${categories.find(c => c.id === selectedCategoryId)?.nome}`}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              Nenhum produto encontrado
            </p>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSelectedCategoryId(null);
                setSearchTerm('');
              }}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all cursor-pointer"
            >
              Ver Todos os Produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product) => {
              const preco = getPreco(product);
              return (
                <div
                  key={product.id}
                  className="group bg-[#2d1b4e] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105 border border-pink-500/10"
                >
                  {/* Badge de Desconto */}
                  {preco.desconto && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        -{preco.desconto}%
                      </span>
                    </div>
                  )}

                  {/* Imagem do Produto */}
                  <Link to={`/produto/${product.id}`} className="block">
                    <div className="aspect-square overflow-hidden bg-[#1a0b2e]">
                      <img
                        src={product.imagem || 'https://via.placeholder.com/300?text=Sem+Imagem'}
                        alt={product.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  {/* Informações do Produto */}
                  <div className="p-3">
                    <Link to={`/produto/${product.id}`}>
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-pink-400 transition-colors">
                        {product.nome}
                      </h3>
                    </Link>

                    {/* Categoria */}
                    {product.categoria && (
                      <p className="text-gray-400 text-xs mb-2">{product.categoria.nome}</p>
                    )}

                    {/* Preço */}
                    <div className="mb-2">
                      {preco.original ? (
                        <>
                          <p className="text-gray-400 text-xs line-through">
                            R$ {preco.original.toFixed(2)}
                          </p>
                          <p className="text-pink-400 font-bold text-lg">
                            R$ {preco.atual.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-pink-400 font-bold text-lg">
                          R$ {preco.atual.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Botão Adicionar ao Carrinho */}
                    {product.quantidade > 0 ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-3 rounded-lg text-xs font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingCart size={14} />
                        Adicionar
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-700 text-gray-400 py-2 px-3 rounded-lg text-xs font-semibold cursor-not-allowed"
                      >
                        Esgotado
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </ClientLayout>
  );
}
