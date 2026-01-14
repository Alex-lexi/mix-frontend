import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClientLayout } from '../../layouts/ClientLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { ArrowRight, Star } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, Category } from '../../types';

export function Home() {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getBestsellers(),
        categoryService.getAll(),
      ]);
      const products = Array.isArray(productsData) ? productsData : [];
      const cats = Array.isArray(categoriesData) ? categoriesData : [];
      setFeaturedProducts(products.slice(0, 8));
      setCategories(cats);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setFeaturedProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
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
    <ClientLayout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Bem-vindo à Mix Catálogo Digital
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Seu mix organizado. Seu atendimento mais rápido.
            </p>
            <Link to="/produtos">
              <Button className="text-lg px-8 py-4">
                Explorar Produtos
                <ArrowRight className="inline ml-2" size={24} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 text-white">Categorias</h2>
            <p className="text-gray-400">Navegue por nossas categorias principais</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/produtos?categoria=${category.id}`}>
                <div className="group">
                  <Card className="text-center hover:scale-105 transition-all cursor-pointer h-full">
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-pink-400 mb-2">{category.nome}</h3>
                      {category.descricao && (
                        <p className="text-sm text-gray-400">{category.descricao}</p>
                      )}
                    </div>
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Produtos em Destaque */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 text-white">Mais Vendidos</h2>
          <p className="text-gray-400">Produtos mais populares da nossa loja</p>
        </div>
        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum produto encontrado</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/produto/${product.id}`}>
                  <Card className="hover:scale-105 transition-all h-full overflow-hidden group">
                    {product.imagem ? (
                      <div className="relative overflow-hidden">
                        <img
                          src={product.imagem}
                          alt={product.nome}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.quantidade <= 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
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
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white group-hover:text-pink-400 transition-colors">
                        {product.nome}
                      </h3>
                      <div className="flex items-center mb-3 gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="text-yellow-400 fill-current" size={14} />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                          R$ {product.preco.toFixed(2)}
                        </p>
                        {product.quantidade > 0 ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold">
                            Disponível
                          </span>
                        ) : (
                          <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-semibold">
                            Esgotado
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/produtos">
                <Button className="px-8 py-3 text-lg">
                  Ver Todos os Produtos
                  <ArrowRight className="inline ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </ClientLayout>
  );
}
