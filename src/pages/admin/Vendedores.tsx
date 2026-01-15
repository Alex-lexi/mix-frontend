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
import { Users, UserPlus, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import { User } from '../../types';
import { vendorService } from '../../services/vendorService';

export function Vendedores() {
  const [vendedores, setVendedores] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
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
      setError(null);

      const response = await vendorService.list();

      setVendedores(response.data);
      setTotal(response.total);
    } catch (error: any) {
      console.error('Erro ao carregar vendedores:', error);
      const message =
        error.response?.data?.message ||
        error.message ||
        'Erro ao listar vendedores';
      setError(message);
      setVendedores([]);
      setTotal(0);
      showToast(message, 'error');
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
      await api.delete(`/auth/vendedores/${id}`);
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

  const formatarData = (dataISO: string) => {
    if (!dataISO) return '-';
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
            <div className="py-8 flex justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={loadVendedores} className="bg-blue-500 hover:bg-blue-600">
                Tentar novamente
              </Button>
            </div>
          ) : total === 0 || vendedores.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400 mb-2">Nenhum vendedor cadastrado ainda</p>
              <p className="text-gray-500 mb-4 text-sm">Cadastre o primeiro vendedor para começar</p>
              <Button onClick={handleOpenModal} className="flex bg-green-300 hover:bg-green-400">
                <UserPlus size={20} className="mr-2 text-gray-900" />
                <p className="text-gray-900">Criar Primeiro Vendedor</p>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-300">
                  Total de vendedores: <span className="font-semibold">{total}</span>
                </p>
              </div>
              <table className="w-full">
                <thead className="bg-purple-500 border-b-2">
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
                    <tr key={vendedor.id} className="border-b hover:bg-purple-400">
                      <td className="py-3 px-4">{vendedor.id}</td>
                      <td className="py-3 px-4 font-medium">{vendedor.nome}</td>
                      <td className="py-3 px-4">{vendedor.email}</td>
                      <td className="py-3 px-4">{vendedor.telefone || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatarData(vendedor.createdAt)}
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
