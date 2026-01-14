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
      setFeaturedProducts(productsData.slice(0, 8));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Bem-vindo à MixStore</h1>
          <p className="text-xl mb-8">Encontre os melhores produtos com os melhores preços</p>
          <Link to="/produtos">
            <Button variant="secondary" className="text-lg">
              Ver Produtos
              <ArrowRight className="inline ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categorias */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/produtos?categoria=${category.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <h3 className="font-semibold text-lg">{category.nome}</h3>
                  {category.descricao && (
                    <p className="text-sm text-gray-600 mt-2">{category.descricao}</p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Produtos em Destaque */}
      <section className="container mx-auto px-4 py-16 bg-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-center">Produtos em Destaque</h2>
        {featuredProducts.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum produto encontrado</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/produto/${product.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  {product.imagem ? (
                    <img
                      src={product.imagem}
                      alt={product.nome}
                      className="w-full h-48 object-cover rounded-t-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-4 flex items-center justify-center">
                      <span className="text-gray-400">Sem imagem</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.nome}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <Star className="text-yellow-400 fill-current" size={16} />
                  </div>
                  <p className="text-2xl font-bold text-primary-600">
                    R$ {product.preco.toFixed(2)}
                  </p>
                  {product.quantidade > 0 ? (
                    <p className="text-sm text-green-600 mt-2">Em estoque</p>
                  ) : (
                    <p className="text-sm text-red-600 mt-2">Fora de estoque</p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/produtos">
            <Button>
              Ver Todos os Produtos
              <ArrowRight className="inline ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </ClientLayout>
  );
}
