import { Link } from 'react-router-dom';
import { ShoppingCart, Star, TrendingUp, Sparkles, Tag } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/useToast';

interface ProductSectionProps {
  title: string;
  products: Product[];
  icon?: 'star' | 'trending' | 'sparkles' | 'tag';
  loading?: boolean;
}

export function ProductSection({ title, products, icon = 'star', loading }: ProductSectionProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product: Product) => {
    addItem(product.id, 1);
    showToast(`${product.nome} adicionado ao carrinho!`, 'success');
  };

  const getIcon = () => {
    const iconProps = { size: 24, className: 'text-pink-400' };
    switch (icon) {
      case 'trending':
        return <TrendingUp {...iconProps} />;
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'tag':
        return <Tag {...iconProps} />;
      default:
        return <Star {...iconProps} />;
    }
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
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
          <div className="w-48 h-8 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-700 rounded mb-3" />
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-6 bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        {getIcon()}
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {products.map((product) => {
          const preco = getPreco(product);
          return (
            <div
              key={product.id}
              className="group bg-[#2d1b4e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105 border border-pink-500/10"
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
              <div className="p-4">
                <Link to={`/produto/${product.id}`}>
                  <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-pink-400 transition-colors">
                    {product.nome}
                  </h3>
                </Link>

                {/* Categoria */}
                {product.categoria && (
                  <p className="text-gray-400 text-xs mb-2">{product.categoria.nome}</p>
                )}

                {/* Preço */}
                <div className="mb-3">
                  {preco.original ? (
                    <>
                      <p className="text-gray-400 text-sm line-through">
                        R$ {preco.original.toFixed(2)}
                      </p>
                      <p className="text-pink-400 font-bold text-xl">
                        R$ {preco.atual.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-pink-400 font-bold text-xl">
                      R$ {preco.atual.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Botão Adicionar ao Carrinho */}
                {product.quantidade > 0 ? (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart size={18} />
                    Adicionar
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-700 text-gray-400 py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Esgotado
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
