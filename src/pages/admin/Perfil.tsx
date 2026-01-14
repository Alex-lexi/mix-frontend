import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Toast } from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

export function Perfil() {
  const { user, updateUser } = useAuth();
  const [nome, setNome] = useState(user?.nome || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = await authService.updateProfile({ nome, telefone });
      updateUser(updatedUser);
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao atualizar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Informações Pessoais</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <Input
              label="Email"
              value={user?.email || ''}
              disabled
            />

            <Input
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
            />

            <Input
              label="Tipo de Usuário"
              value={user?.tipo || ''}
              disabled
            />

            <Button type="submit" loading={loading}>
              Salvar Alterações
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Informações da Conta</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Membro desde</p>
              <p className="font-medium">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('pt-BR')
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Última atualização</p>
              <p className="font-medium">
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString('pt-BR')
                  : '-'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Toast {...toast} onClose={hideToast} />
    </AdminLayout>
  );
}
