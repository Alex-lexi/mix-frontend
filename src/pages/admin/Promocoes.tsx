import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { Tag, Package, Edit2, XCircle } from 'lucide-react';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function Promocoes() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [promotionData, setPromotionData] = useState({
    emPromocao: true,
    precoPromocional: 0,
  });

  const { toast, showToast, hideToast } = useToast();

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await productService.getPromotions(50);
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
      showToast('Erro ao carregar promoções', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setPromotionData({
      emPromocao: true,
      precoPromocional: product.precoPromocional || product.preco * 0.8,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await productService.setPromotion(selectedProduct.id, promotionData);
      showToast('Promoção atualizada com sucesso!', 'success');
      handleCloseModal();
      loadPromotions();
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      showToast(err.response?.data?.message || 'Erro ao atualizar promoção', 'error');
    }
  };

  const handleRemovePromotion = async (product: Product) => {
    if (!window.confirm('Tem certeza que deseja remover esta promoção?')) {
      return;
    }

    try {
      await productService.setPromotion(product.id, { emPromocao: false });
      showToast('Promoção removida com sucesso!', 'success');
      loadPromotions();
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      showToast(err.response?.data?.message || 'Erro ao remover promoção', 'error');
    }
  };

  const handleRemovePromotionFromModal = async () => {
    if (!selectedProduct) return;

    if (!window.confirm('Tem certeza que deseja remover esta promoção?')) {
      return;
    }

    try {
      await productService.setPromotion(selectedProduct.id, { emPromocao: false });
      showToast('Promoção removida com sucesso!', 'success');
      handleCloseModal();
      loadPromotions();
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      showToast(err.response?.data?.message || 'Erro ao remover promoção', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Tag size={32} className="text-pink-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Promoções de Produtos</h1>
            <p className="text-gray-400 text-sm">
              Gerencie preços promocionais de forma rápida para admin e vendedores
            </p>
          </div>
        </div>
      </div>

      <Card>
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <Tag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400 mb-2">Nenhum produto em promoção no momento</p>
            <p className="text-gray-500 text-sm">
              Ative promoções pela tela de Produtos ou selecione um produto para começar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Produto</th>
                  <th className="text-left py-3 px-4">Preço Normal</th>
                  <th className="text-left py-3 px-4">Preço Promocional</th>
                  <th className="text-left py-3 px-4">Categoria</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-purple-300/20">
                    <td className="py-3 px-4 flex items-center gap-3">
                      {product.imagem ? (
                        <img
                          src={product.imagem}
                          alt={product.nome}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Package size={18} className="text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium">{product.nome}</span>
                    </td>
                    <td className="py-3 px-4">
                      R$ {product.preco.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-green-500 font-semibold">
                      {product.precoPromocional
                        ? `R$ ${product.precoPromocional.toFixed(2)}`
                        : '-'}
                    </td>
                    <td className="py-3 px-4">{product.categoria?.nome || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 size={16} />
                          <span className="text-sm">Editar</span>
                        </button>
                        <button
                          onClick={() => handleRemovePromotion(product)}
                          className="text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-1"
                        >
                          <XCircle size={16} />
                          <span className="text-sm">Remover</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProduct ? `Editar Promoção - ${selectedProduct.nome}` : 'Editar Promoção'}
        size="md"
      >
        {selectedProduct && (
          <form onSubmit={handlePromotionSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Preço Normal</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {selectedProduct.preco.toFixed(2)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Promocional
              </label>
              <input
                type="number"
                step="0.01"
                value={promotionData.precoPromocional}
                onChange={(e) =>
                  setPromotionData({
                    ...promotionData,
                    precoPromocional: parseFloat(e.target.value),
                  })
                }
                className="input-field text-gray-900"
                required
              />
            </div>

            {selectedProduct && promotionData.precoPromocional > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-semibold">
                  Desconto:{' '}
                  {Math.round(
                    ((selectedProduct.preco - promotionData.precoPromocional) /
                      selectedProduct.preco) * 100
                  )}
                  %
                </p>
                <p className="text-sm text-green-600">
                  Economia: R${' '}
                  {(selectedProduct.preco - promotionData.precoPromocional).toFixed(2)}
                </p>
              </div>
            )}

            {selectedProduct &&
              promotionData.precoPromocional >= selectedProduct.preco && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700 font-semibold">
                    ⚠️ O preço promocional deve ser menor que o preço normal
                  </p>
                </div>
              )}

            <div className="flex justify-between gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleRemovePromotionFromModal}
                >
                  Remover Promoção
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !!selectedProduct &&
                    promotionData.precoPromocional >= selectedProduct.preco
                  }
                  className="bg-purple-400 hover:bg-purple-500"
                >
                  Salvar
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      <Toast {...toast} onClose={hideToast} />
    </AdminLayout>
  );
}
