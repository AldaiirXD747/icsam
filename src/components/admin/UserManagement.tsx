
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserAccount, UserRole } from '@/types/championship';
import { Team } from '@/types';
import { getTeams } from '@/lib/api';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Check, PencilLine, Trash2, UserPlus, UserCog } from 'lucide-react';

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    id?: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    team_id: string | null;
  }>({
    email: '',
    password: '',
    name: '',
    role: 'team_manager',
    team_id: null
  });
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Fetch all users with their team information
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('team_accounts')
          .select(`
            id,
            email,
            name,
            role,
            team_id,
            created_at,
            teams:team_id (
              id,
              name
            )
          `);

        if (error) throw error;

        return (data || []).map((user: any) => ({
          id: user.id,
          email: user.email,
          name: user.name || 'Sem nome',
          role: user.role || 'team_manager',
          team_id: user.team_id,
          team_name: user.teams?.name || null,
          created_at: user.created_at
        })) as UserAccount[];
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Erro ao carregar usuários');
        return [];
      }
    }
  });

  // Fetch teams for the dropdown selection
  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams()
  });

  // Mutation to create a new user
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      // First, create the user in Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role,
          team_id: userData.team_id
        }
      });

      if (authError) throw authError;

      // Then, store additional info in team_accounts table
      const { error: teamError } = await supabase
        .from('team_accounts')
        .insert({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          team_id: userData.team_id,
          user_id: authData.user.id
        });

      if (teamError) throw teamError;

      return authData.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Usuário criado com sucesso!');
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error creating user:', error);
      toast.error(`Erro ao criar usuário: ${error.message}`);
    }
  });

  // Mutation to update a user
  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const updates: any = {
        name: userData.name,
        role: userData.role,
        team_id: userData.role === 'admin' ? null : userData.team_id
      };

      // Update team_accounts table
      const { error: teamError } = await supabase
        .from('team_accounts')
        .update(updates)
        .eq('id', userData.id);

      if (teamError) throw teamError;

      // Also update user_metadata in auth table if possible
      try {
        await supabase.auth.admin.updateUserById(userData.id, {
          user_metadata: {
            name: userData.name,
            role: userData.role,
            team_id: userData.role === 'admin' ? null : userData.team_id
          }
        });
      } catch (e) {
        console.log('Unable to update auth user metadata:', e);
        // Continue anyway as this is not critical
      }

      return { id: userData.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Usuário atualizado com sucesso!');
      setIsEditModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      toast.error(`Erro ao atualizar usuário: ${error.message}`);
    }
  });

  // Mutation to delete a user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Delete from auth (this will cascade delete from team_accounts if properly set up)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      return { id: userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Usuário removido com sucesso!');
      setUserToDelete(null);
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast.error(`Erro ao remover usuário: ${error.message}`);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value,
      // If changing to admin, remove team association
      team_id: value === 'admin' ? null : prev.team_id
    }));
  };

  const handleTeamChange = (value: string) => {
    setFormData(prev => ({ ...prev, team_id: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name || !formData.role) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (formData.role === 'team_manager' && !formData.team_id) {
      toast.error('Selecione um time para o responsável');
      return;
    }
    
    if (formData.id) {
      // Update existing user
      updateUserMutation.mutate(formData);
    } else {
      // Create new user
      if (!formData.password) {
        toast.error('Defina uma senha para o novo usuário');
        return;
      }
      createUserMutation.mutate(formData);
    }
  };

  const handleEditUser = (user: UserAccount) => {
    setFormData({
      id: user.id,
      email: user.email,
      password: '', // Don't show password in edit mode
      name: user.name,
      role: user.role,
      team_id: user.team_id || null
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'team_manager',
      team_id: null
    });
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Crie e gerencie usuários administradores e responsáveis de times
              </CardDescription>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                  className="bg-blue-primary hover:bg-blue-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Adicione um novo usuário ao sistema com função específica.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nome
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Senha
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Função
                      </Label>
                      <Select 
                        value={formData.role} 
                        onValueChange={(value) => handleRoleChange(value as UserRole)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="team_manager">Responsável de Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.role === 'team_manager' && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="team" className="text-right">
                          Time
                        </Label>
                        <Select 
                          value={formData.team_id || undefined} 
                          onValueChange={handleTeamChange}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione um time" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team: Team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-blue-primary">
                      <Check className="mr-2 h-4 w-4" /> Salvar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Lista de usuários do sistema</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingUsers ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Carregando usuários...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Administrador
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Responsável de Time
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{user.team_name || 'N/A'}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Usuário</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover o usuário "{user.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={confirmDeleteUser}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Atualize as informações do usuário.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  E-mail
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Função
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleRoleChange(value as UserRole)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="team_manager">Responsável de Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'team_manager' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-team" className="text-right">
                    Time
                  </Label>
                  <Select 
                    value={formData.team_id || undefined} 
                    onValueChange={handleTeamChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um time" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team: Team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-primary">
                <Check className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
