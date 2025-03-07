
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Pencil, Trash2, UserPlus } from 'lucide-react';
import { UserAccount, UserRole } from '@/types/championship';
import { supabase } from '@/integrations/supabase/client';
import { generatePassword } from '@/lib/utils';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [teams, setTeams] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    team_id?: string | null;
    selectedTeams: string[];
  }>({
    name: '',
    email: '',
    password: '',
    role: 'team_manager',
    selectedTeams: []
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [generatingPassword, setGeneratingPassword] = useState(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Carregar usuários
      const { data: usersData, error: usersError } = await supabase
        .from('app_users')
        .select('*')
        .order('name');
      
      if (usersError) throw usersError;
      
      // Carregar associações de times com usuários
      const { data: teamAssociations, error: associationsError } = await supabase
        .from('user_team_associations')
        .select(`
          user_id,
          team_id,
          teams:team_id (
            id,
            name
          )
        `);
      
      if (associationsError) throw associationsError;
      
      // Mapear times para usuários
      const userTeams: Record<string, { team_id: string, team_name: string }[]> = {};
      
      teamAssociations.forEach(association => {
        const userId = association.user_id;
        const teamId = association.team_id;
        const teamName = association.teams?.name || '';
        
        if (!userTeams[userId]) {
          userTeams[userId] = [];
        }
        
        userTeams[userId].push({ team_id: teamId, team_name: teamName });
      });
      
      // Combinar dados
      const enrichedUsers: UserAccount[] = usersData.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        created_at: user.created_at,
        // Se o usuário gerencia times, adicione os times
        ...(userTeams[user.id] && userTeams[user.id].length > 0 ? {
          team_id: userTeams[user.id][0].team_id,
          team_name: userTeams[user.id][0].team_name,
        } : {})
      }));
      
      setUsers(enrichedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários."
      });
      setLoading(false);
    }
  };

  const loadTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      setTeams(data || []);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar times",
        description: "Não foi possível carregar a lista de times."
      });
    }
  };

  useEffect(() => {
    loadUsers();
    loadTeams();
  }, []);

  const openCreateDialog = () => {
    setFormData({
      name: '',
      email: '',
      password: generatePassword(),
      role: 'team_manager',
      selectedTeams: []
    });
    setDialogMode('create');
    setShowUserDialog(true);
  };

  const openEditDialog = (user: UserAccount) => {
    const selectedTeams: string[] = [];
    
    if (user.team_id) {
      selectedTeams.push(user.team_id);
    }
    
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '', // Não exibimos a senha atual, usuário pode redefinir
      role: user.role,
      team_id: user.team_id,
      selectedTeams
    });
    setDialogMode('edit');
    setShowUserDialog(true);
  };

  const openDeleteDialog = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteDialog(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value as UserRole,
      // Se mudar para admin, limpa os times selecionados
      selectedTeams: value === 'admin' ? [] : prev.selectedTeams
    }));
  };

  const handleTeamSelect = (teamId: string) => {
    setFormData(prev => {
      // Se o time já está selecionado, remove-o
      if (prev.selectedTeams.includes(teamId)) {
        return {
          ...prev,
          selectedTeams: prev.selectedTeams.filter(id => id !== teamId)
        };
      }
      
      // Caso contrário, adiciona o time
      return {
        ...prev,
        selectedTeams: [...prev.selectedTeams, teamId]
      };
    });
  };

  const handleGeneratePassword = () => {
    setGeneratingPassword(true);
    
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        password: generatePassword()
      }));
      setGeneratingPassword(false);
    }, 500);
  };

  const saveUser = async () => {
    try {
      if (!formData.name || !formData.email || (!formData.id && !formData.password)) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios."
        });
        return;
      }

      if (formData.role === 'team_manager' && formData.selectedTeams.length === 0) {
        toast({
          variant: "destructive",
          title: "Time não selecionado",
          description: "Um responsável de time precisa ter pelo menos um time associado."
        });
        return;
      }

      setLoading(true);

      // Criar ou atualizar usuário
      let userId: string;

      if (dialogMode === 'create') {
        // Chamar função RPC para criar o usuário
        const { data, error } = await supabase
          .rpc('create_user', {
            p_name: formData.name,
            p_email: formData.email,
            p_password: formData.password,
            p_role: formData.role
          });
        
        if (error) throw error;
        
        userId = data as string;
      } else {
        // Atualizar usuário existente
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        
        // Apenas atualiza a senha se uma nova senha for fornecida
        if (formData.password) {
          // Em um cenário real, usaríamos uma função RPC para atualizar com senha hash
          const { data, error } = await supabase
            .from('app_users')
            .update(updateData)
            .eq('id', formData.id)
            .select('id');
          
          if (error) throw error;
          
          // Se uma senha foi fornecida, atualizá-la separadamente
          if (formData.password) {
            // Chamar função RPC para atualizar a senha
            const { error: pwdError } = await supabase
              .rpc('update_user_password', {
                p_user_id: formData.id,
                p_password: formData.password
              });
            
            if (pwdError) throw pwdError;
          }
          
          userId = formData.id!;
        } else {
          // Atualização sem senha
          const { data, error } = await supabase
            .from('app_users')
            .update(updateData)
            .eq('id', formData.id)
            .select('id');
          
          if (error) throw error;
          
          userId = formData.id!;
        }
      }

      // Se for um responsável de time, atualizar as associações de times
      if (formData.role === 'team_manager') {
        // Primeiro remover associações existentes
        const { error: deleteError } = await supabase
          .from('user_team_associations')
          .delete()
          .eq('user_id', userId);
        
        if (deleteError) throw deleteError;
        
        // Adicionar novas associações
        const teamAssociations = formData.selectedTeams.map(teamId => ({
          user_id: userId,
          team_id: teamId
        }));
        
        if (teamAssociations.length > 0) {
          const { error: insertError } = await supabase
            .from('user_team_associations')
            .insert(teamAssociations);
          
          if (insertError) throw insertError;
        }
      }

      setShowUserDialog(false);
      setLoading(false);
      
      toast({
        title: dialogMode === 'create' ? "Usuário criado" : "Usuário atualizado",
        description: dialogMode === 'create' 
          ? "O novo usuário foi criado com sucesso."
          : "O usuário foi atualizado com sucesso."
      });
      
      loadUsers();
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      setLoading(false);
      
      toast({
        variant: "destructive",
        title: "Erro ao salvar usuário",
        description: error.message || "Ocorreu um erro ao salvar o usuário."
      });
    }
  };

  const deleteUser = async () => {
    try {
      if (!selectedUserId) return;
      
      setLoading(true);
      
      // Excluir usuário (as associações serão excluídas em cascata devido à constraint ON DELETE CASCADE)
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', selectedUserId);
      
      if (error) throw error;
      
      setShowDeleteDialog(false);
      setSelectedUserId(null);
      setLoading(false);
      
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso."
      });
      
      loadUsers();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      setLoading(false);
      
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: error.message || "Ocorreu um erro ao excluir o usuário."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Adicionar Usuário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Gerencie usuários administradores e responsáveis por times
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-blue-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Time(s)</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === 'admin' ? 'Administrador' : 'Responsável de Time'}
                      </TableCell>
                      <TableCell>
                        {user.team_name || (user.role === 'admin' ? 'N/A' : 'Nenhum')}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(user)}
                          className="px-2 py-0 h-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => openDeleteDialog(user.id)}
                          className="px-2 py-0 h-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para criar/editar usuário */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Adicionar Usuário' : 'Editar Usuário'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Preencha os dados para criar um novo usuário no sistema.' 
                : 'Modifique os dados do usuário existente.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">
                  {dialogMode === 'create' ? 'Senha' : 'Nova Senha (opcional)'}
                </Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGeneratePassword}
                  disabled={generatingPassword}
                  className="h-6 px-2 text-xs"
                >
                  {generatingPassword ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Gerar Senha
                </Button>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="text" 
                value={formData.password} 
                onChange={handleChange}
                placeholder={dialogMode === 'create' ? "Senha" : "Deixe em branco para manter a mesma senha"}
              />
              {dialogMode === 'create' && (
                <p className="text-xs text-muted-foreground">
                  Uma senha aleatória foi gerada. Você pode mantê-la ou alterá-la.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="team_manager">Responsável de Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.role === 'team_manager' && (
              <div className="space-y-2">
                <Label>Times Associados</Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                  {teams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum time disponível</p>
                  ) : (
                    teams.map(team => (
                      <div key={team.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`team-${team.id}`} 
                          checked={formData.selectedTeams.includes(team.id)}
                          onCheckedChange={() => handleTeamSelect(team.id)}
                        />
                        <Label htmlFor={`team-${team.id}`} className="cursor-pointer">
                          {team.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
                {teams.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Selecione um ou mais times que este usuário irá gerenciar.
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={saveUser} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir usuário */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
