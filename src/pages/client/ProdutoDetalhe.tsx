import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClientLayout } from '../../layouts/ClientLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { productService } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import { Product } from '../../types';

export function ProdutoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const { addToCart } = useCart();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const [productData, similarData] = await Promise.all([
        productService.getById(productId),
        productService.getSimilar(productId),
      ]);
      setProduct(productData);
      setSimilarProducts(similarData.slice(0, 4));
    } catch (error) {
      showToast('Erro ao carregar produto', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart({ produtoId: product.id, quantidade });
      showToast('Produto adicionado ao carrinho!', 'success');
      setQuantidade(1);
    } catch (error) {
      showToast('Erro ao adicionar ao carrinho', 'error');
    }
  };

  const incrementQuantity = () => {
    if (product && quantidade < product.quantidade) {
      setQuantidade(quantidade + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <Loading fullScreen />
      </ClientLayout>
    );
  }

  if (!product) {
    return (
      <ClientLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
          <Link to="/produtos">
            <Button>Voltar para Produtos</Button>
          </Link>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/produtos" className="hover:text-primary-600">Produtos</Link>
          <span className="mx-2">/</span>
          <span>{product.nome}</span>
        </div>

        {/* Detalhes do Produto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div>
            {product.imagem ? (
              <img
                src={product.imagem}
                alt={product.nome}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-gray-400 text-xl">Sem imagem</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4">{product.nome}</h1>

            {product.categoria && (
              <p className="text-gray-600 mb-4">
                Categoria: <span className="font-medium">{product.categoria.nome}</span>
              </p>
            )}

            <div className="mb-6">
              {product.emPromocao && product.precoPromocional ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      🔥 PROMOÇÃO
                    </span>
                    <span className="text-green-600 font-semibold">
                      {Math.round(((product.preco - product.precoPromocional) / product.preco) * 100)}% OFF
                    </span>
                  </div>
                  <p className="text-2xl text-gray-400 line-through mb-1">
                    R$ {product.preco.toFixed(2)}
                  </p>
                  <p className="text-5xl font-bold text-pink-600">
                    R$ {product.precoPromocional.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Economize R$ {(product.preco - product.precoPromocional).toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-4xl font-bold text-primary-600">
                  R$ {product.preco.toFixed(2)}
                </p>
              )}
            </div>

            {product.descricao && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Descrição</h3>
                <p className="text-gray-700">{product.descricao}</p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                {product.cor && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cor</p>
                    <p className="font-medium">{product.cor}</p>
                  </div>
                )}
                {product.tamanho && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tamanho</p>
                    <p className="font-medium">{product.tamanho}</p>
                  </div>
                )}
              </div>

              {product.quantidade > 0 ? (
                <>
                  <p className="text-green-600 font-medium mb-4">
                    {product.quantidade} unidade{product.quantidade !== 1 ? 's' : ''} em estoque
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <label className="font-medium">Quantidade:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        disabled={quantidade <= 1}
                      >
                        <Minus size={20} />
                      </button>
                      <span className="px-6 py-2 font-medium">{quantidade}</span>
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        disabled={quantidade >= product.quantidade}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <Button onClick={handleAddToCart} className="w-1/3 text-lg bg-green-300 hover:bg-green-400">
                    <ShoppingCart className="inline mr-2 text-gray-900" size={20} />
                    <p className='text-gray-900'>Adicionar ao Carrinho</p>
                  </Button>
                </>
              ) : (
                <div>
                  <p className="text-red-600 font-medium mb-4">Produto fora de estoque</p>
                  <Button disabled className="w-full text-lg">
                    Indisponível
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Produtos Similares */}
        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Produtos Similares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similar) => (
                <Link key={similar.id} to={`/produto/${similar.id}`}>
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    {similar.imagem ? (
                      <img
                        src={similar.imagem}
                        alt={similar.nome}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                        <span className="text-gray-400">Sem imagem</span>
                      </div>
                    )}
                    <h3 className="font-semibold mb-2 line-clamp-2">{similar.nome}</h3>
                    <p className="text-xl font-bold text-primary-600">
                      R$ {similar.preco.toFixed(2)}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Toast {...toast} onClose={hideToast} />
    </ClientLayout>
  );
}
