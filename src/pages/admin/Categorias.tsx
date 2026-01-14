import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Loading } from '../../components/Loading';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { Category, CreateCategoryData } from '../../types';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function Categorias() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    nome: '',
    descricao: '',
  });
  const { toast, showToast, hideToast } = useToast();

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch {
      showToast('Erro ao carregar categorias', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ nome: category.nome, descricao: category.descricao || '' });
    } else {
      setEditingCategory(null);
      setFormData({ nome: '', descricao: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ nome: '', descricao: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        showToast('Categoria atualizada com sucesso!', 'success');
      } else {
        await categoryService.create(formData);
        showToast('Categoria criada com sucesso!', 'success');
      }
      handleCloseModal();
      loadCategories();
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      showToast(err.response?.data?.message || 'Erro ao salvar categoria', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await categoryService.delete(id);
        showToast('Categoria deletada com sucesso!', 'success');
        loadCategories();
      } catch (error: unknown) {
        const err = error as ErrorResponse;
        showToast(err.response?.data?.message || 'Erro ao deletar categoria', 'error');
      }
    }
  };

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
        <h1 className="text-3xl font-bold">Categorias</h1>
        <Button onClick={() => handleOpenModal()} className='bg-purple-300 hover:bg-purple-400 flex items-center'>
          <Plus size={20} className="inline mr-2 text-gray-900" />
          <p className='text-gray-900'>Nova Categoria</p>
          
        </Button>
      </div>

      <Card>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma categoria encontrada</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Descrição</th>
                  <th className="text-right py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-purple-300/30">
                    <td className="py-3 px-4">{category.id}</td>
                    <td className="py-3 px-4 font-medium">{category.nome}</td>
                    <td className="py-3 px-4 text-gray-600">{category.descricao || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(category)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className='text-gray-900'
            required
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
            <Button type="submit" className='bg-purple-400 hover:bg-purple-500'>
              {editingCategory ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast {...toast} onClose={hideToast} />
    </AdminLayout>
  );
}
