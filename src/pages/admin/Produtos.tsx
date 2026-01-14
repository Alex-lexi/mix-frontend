import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, CreateProductData, Category } from '../../types';

export function Produtos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao salvar produto', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await productService.delete(id);
        showToast('Produto deletado com sucesso!', 'success');
        loadData();
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Erro ao deletar produto', 'error');
      }
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
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} className="inline mr-2" />
          Novo Produto
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
                  <th className="text-left py-3 px-4">Categoria</th>
                  <th className="text-left py-3 px-4">Quantidade</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
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
                    <td className="py-3 px-4">R$ {product.preco.toFixed(2)}</td>
                    <td className="py-3 px-4">{product.categoria?.nome || '-'}</td>
                    <td className="py-3 px-4">{product.quantidade}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
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
              required
            />

            <Input
              label="Preço"
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
              required
            />

            <Input
              label="Quantidade"
              type="number"
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
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
                className="input-field"
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
            />

            <Input
              label="Tamanho (opcional)"
              value={formData.tamanho}
              onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
            />
          </div>

          <Input
            label="URL da Imagem"
            value={formData.imagem}
            onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
            placeholder="https://..."
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="input-field min-h-[100px]"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingProduct ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast {...toast} onClose={hideToast} />
    </AdminLayout>
  );
}
