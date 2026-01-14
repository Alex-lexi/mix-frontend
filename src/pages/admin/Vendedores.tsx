import { useState, useEffect } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { Loading } from '../../components/Loading';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { Users, UserPlus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import { User } from '../../types';

export function Vendedores() {
  const [vendedores, setVendedores] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: ''
  });

  // Verificar se é admin
  const isAdmin = user?.tipo === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadVendedores();
    }
  }, [isAdmin]);

  const loadVendedores = async () => {
    try {
      setLoading(true);
      // TODO: Criar endpoint no backend para listar vendedores
      // Por enquanto, vamos buscar todos os usuários e filtrar
      const response = await api.get('/auth/usuarios');
      const allUsers = response.data.data || response.data;
      const vendedoresList = allUsers.filter((u: User) => u.tipo === 'vendedor');
      setVendedores(vendedoresList);
    } catch (error: any) {
      console.error('Erro ao carregar vendedores:', error);
      // Se o endpoint não existir, mostrar array vazio
      setVendedores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ nome: '', email: '', senha: '', telefone: '' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ nome: '', email: '', senha: '', telefone: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      showToast('Apenas administradores podem criar vendedores', 'error');
      return;
    }

    if (formData.senha.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres', 'error');
      return;
    }

    try {
      // Criar vendedor com autenticação de admin
      await api.post('/auth/register', {
        ...formData,
        tipo: 'vendedor'
      });

      showToast('Vendedor criado com sucesso!', 'success');
      handleCloseModal();
      loadVendedores();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Erro ao criar vendedor',
        'error'
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este vendedor?')) {
      return;
    }

    try {
      await api.delete(`/auth/usuarios/${id}`);
      showToast('Vendedor excluído com sucesso', 'success');
      loadVendedores();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Erro ao excluir vendedor',
        'error'
      );
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-400 text-lg">
              Apenas administradores podem acessar esta página
            </p>
          </div>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={32} className="text-pink-400" />
            <h1 className="text-3xl font-bold text-white">Gerenciar Vendedores</h1>
          </div>
          <Button onClick={handleOpenModal} className='flex bg-green-300 hover:bg-green-400'>
            <UserPlus size={20} className="mr-2 text-gray-900" />
            <p className='text-gray-900'>Criar Vendedor</p>
            
          </Button>
        </div>

        <Card>
          {loading ? (
            <Loading />
          ) : vendedores.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400 mb-4">Nenhum vendedor cadastrado ainda</p>
              <Button onClick={handleOpenModal} className='flex bg-green-300 hover:bg-green-400'>
                <UserPlus size={20} className="mr-2 text-gray-900" />
                <p className='text-gray-900'>Criar Primeiro Vendedor</p>
                
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2">
                  <tr>
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Telefone</th>
                    <th className="text-left py-3 px-4">Criado em</th>
                    <th className="text-right py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vendedores.map((vendedor) => (
                    <tr key={vendedor.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{vendedor.id}</td>
                      <td className="py-3 px-4 font-medium">{vendedor.nome}</td>
                      <td className="py-3 px-4">{vendedor.email}</td>
                      <td className="py-3 px-4">{vendedor.telefone || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(vendedor.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDelete(vendedor.id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                            title="Excluir"
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
      </div>

      {/* Modal de Criação de Vendedor */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Criar Novo Vendedor"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
          <Input
            label="Nome Completo"
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Nome do vendedor"
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@exemplo.com"
            required
          />

          <Input
            label="Telefone (opcional)"
            type="tel"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            placeholder="(00) 00000-0000"
          />

          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Atenção:</strong> O vendedor receberá um email com as credenciais de acesso.
              Recomende que ele altere a senha no primeiro login.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" className='bg-green-300 text-gray-900 hover:bg-green-400 flex'>
              <UserPlus size={18} className="mr-2 text-gray-900" />
              <p className='text-gray-900'>Criar Vendedor</p>
              
            </Button>
          </div>
        </form>
      </Modal>

      <Toast {...toast} onClose={hideToast} />
    </AdminLayout>
  );
}
