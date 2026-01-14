import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Plus, Edit2, Trash2, Search, Package, Tag } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, CreateProductData, Category } from '../../types';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function Produtos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [promotionProduct, setPromotionProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [promotionData, setPromotionData] = useState({
    emPromocao: false,
    precoPromocional: 0,
  });
  const [formData, setFormData] = useState<CreateProductData>({
    nome: '',
    preco: 0,
    descricao: '',
    imagem: '',
    quantidade: 0,
    categoriaId: undefined,
    cor: '',
    tamanho: '',
  });
  const { toast, showToast, hideToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nome: product.nome,
        preco: product.preco,
        descricao: product.descricao || '',
        imagem: product.imagem || '',
        quantidade: product.quantidade,
        categoriaId: product.categoriaId,
        cor: product.cor || '',
        tamanho: product.tamanho || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nome: '',
        preco: 0,
        descricao: '',
        imagem: '',
        quantidade: 0,
        categoriaId: undefined,
        cor: '',
        tamanho: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
        showToast('Produto atualizado com sucesso!', 'success');
      } else {
        await productService.create(formData);
        showToast('Produto criado com sucesso!', 'success');
      }
      handleCloseModal();
      loadData();
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      showToast(err.response?.data?.message || 'Erro ao salvar produto', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await productService.delete(id);
        showToast('Produto deletado com sucesso!', 'success');
        loadData();
      } catch (error: unknown) {
        const err = error as ErrorResponse;
        showToast(err.response?.data?.message || 'Erro ao deletar produto', 'error');
      }
    }
  };

  const handleOpenPromotionModal = (product: Product) => {
    setPromotionProduct(product);
    setPromotionData({
      emPromocao: product.emPromocao || false,
      precoPromocional: product.precoPromocional || product.preco * 0.8,
    });
    setIsPromotionModalOpen(true);
  };

  const handleClosePromotionModal = () => {
    setIsPromotionModalOpen(false);
    setPromotionProduct(null);
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promotionProduct) return;

    try {
      await productService.setPromotion(promotionProduct.id, promotionData);
      showToast(
        promotionData.emPromocao 
          ? 'Promoção ativada com sucesso!' 
          : 'Promoção removida com sucesso!',
        'success'
      );
      handleClosePromotionModal();
      loadData();
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      showToast(err.response?.data?.message || 'Erro ao definir promoção', 'error');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <Loading fullScreen />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button onClick={() => handleOpenModal()} className='bg-purple-300 hover:bg-purple-400 flex items-center'>
          <Plus size={20} className="inline mr-2 text-gray-900" />
          <p className='text-gray-900'>Novo Produto</p>
         
        </Button>
      </div>

      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </Card>

      <Card>
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum produto encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Imagem</th>
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Preço</th>
                  <th className="text-left py-3 px-4">Promoção</th>
                  <th className="text-left py-3 px-4">Categoria</th>
                  <th className="text-left py-3 px-4">Quantidade</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-purple-300/30">
                    <td className="py-3 px-4">
                      {product.imagem ? (
                        <img
                          src={product.imagem}
                          alt={product.nome}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">{product.nome}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className={product.emPromocao ? 'line-through text-gray-400 text-sm' : ''}>
                          R$ {product.preco.toFixed(2)}
                        </span>
                        {product.emPromocao && product.precoPromocional && (
                          <div className="text-green-600 font-semibold">
                            R$ {product.precoPromocional.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {product.emPromocao ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          <Tag size={12} />
                          Em Promoção
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Sem promoção</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{product.categoria?.nome || '-'}</td>
                    <td className="py-3 px-4">{product.quantidade}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenPromotionModal(product)}
                          className="text-green-600 hover:text-green-800 cursor-pointer"
                          title="Gerenciar Promoção"
                        >
                          <Tag size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 size={18} />
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
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className='text-gray-900'
              required
            />

            <Input
              label="Preço"
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
              className='text-gray-900'
              required
            />

            <Input
              label="Quantidade"
              type="number"
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
              className='text-gray-900'
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={formData.categoriaId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, categoriaId: e.target.value ? parseInt(e.target.value) : undefined })
                }
                className="input-field text-gray-900"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Cor (opcional)"
              value={formData.cor}
              onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
              className='text-gray-900'
            />

            <Input
              label="Tamanho (opcional)"
              value={formData.tamanho}
              onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
              className='text-gray-900'
            />
          </div>

          <Input
            label="URL da Imagem"
            value={formData.imagem}
            onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
            placeholder="https://..."
            className='text-gray-900'
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="input-field min-h-[100px] text-gray-900"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" className='bg-green-300 hover:bg-green-400'>
              <p className='text-gray-900'>{editingProduct ? 'Salvar' : 'Criar'}</p>
              
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Promoção */}
      <Modal
        isOpen={isPromotionModalOpen}
        onClose={handleClosePromotionModal}
        title={`Gerenciar Promoção - ${promotionProduct?.nome}`}
        size="md"
      >
        <form onSubmit={handlePromotionSubmit}>
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">Preço Normal</p>
              <p className="text-2xl font-bold text-gray-800">
                R$ {promotionProduct?.preco.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="emPromocao"
                checked={promotionData.emPromocao}
                onChange={(e) => setPromotionData({ 
                  ...promotionData, 
                  emPromocao: e.target.checked 
                })}
                className="w-5 h-5 text-pink-600 rounded focus:ring-2 focus:ring-pink-500"
              />
              <label htmlFor="emPromocao" className="text-lg font-semibold text-gray-700">
                Ativar Promoção
              </label>
            </div>

            {promotionData.emPromocao && (
              <div>
                <Input
                  label="Preço Promocional"
                  type="number"
                  step="0.01"
                  value={promotionData.precoPromocional}
                  onChange={(e) => setPromotionData({ 
                    ...promotionData, 
                    precoPromocional: parseFloat(e.target.value) 
                  })}
                  className='text-gray-900'
                  required
                />
                {promotionProduct && promotionData.precoPromocional > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 font-semibold">
                      Desconto: {Math.round(((promotionProduct.preco - promotionData.precoPromocional) / promotionProduct.preco) * 100)}%
                    </p>
                    <p className="text-sm text-green-600">
                      Economia: R$ {(promotionProduct.preco - promotionData.precoPromocional).toFixed(2)}
                    </p>
                  </div>
                )}
                {promotionProduct && promotionData.precoPromocional >= promotionProduct.preco && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700 font-semibold">
                      ⚠️ O preço promocional deve ser menor que o preço normal
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={handleClosePromotionModal}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={promotionData.emPromocao && promotionProduct && promotionData.precoPromocional >= promotionProduct.preco}
              className='bg-purple-400 hover:bg-purple-500'
            >
              {promotionData.emPromocao ? 'Ativar Promoção' : 'Remover Promoção'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast {...toast} onClose={hideToast} />
    </AdminLayout>
  );
}
