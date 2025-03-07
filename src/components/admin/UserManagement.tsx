
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, RefreshCw, Key, UserPlus, Users } from 'lucide-react';
import { UserAccount, UserRole, CreateUserPayload, UpdateUserPayload, UserTeamAssociation } from '@/types/championship';
import { generatePassword } from '@/lib/utils';

// Schema para criação de usuário
const createUserSchema = z.object({
  name: z.string().min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha precisa ter pelo menos 6 caracteres" }),
  role: z.enum(['admin', 'team_manager'] as const),
  teams: z.array(z.string()).optional(),
});

// Schema para atualização de usuário
const updateUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  role: z.enum(['admin', 'team_manager'] as const),
  password: z.string().min(6, { message: "Senha precisa ter pelo menos 6 caracteres" }).optional(),
  teams: z.array(z.string()).optional(),
});

const UserManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [showPassword, setShowPassword] = useState(true);
  const queryClient = useQueryClient();

  // Formulário para criação de usuário
  const createForm = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: generatePassword(),
      role: 'team_manager',
      teams: [],
    },
  });

  // Formulário para edição de usuário
  const updateForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      role: 'team_manager',
      teams: [],
    },
  });

  // Buscar todos os usuários
  const { data: users = [], isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['app-users'],
    queryFn: async () => {
      try {
        // Buscar usuários
        const { data: users, error } = await supabase
          .from('app_users')
          .select('id, name, email, role, created_at')
          .order('name');
        
        if (error) {
          throw error;
        }

        // Para cada usuário, buscar associações com times
        const usersWithTeams = await Promise.all(users.map(async (user) => {
          const { data: associations, error } = await supabase
            .from('user_team_associations')
            .select(`
              id, 
              user_id, 
              team_id,
              teams (
                id,
                name,
                category,
                logo
              )
            `)
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Erro ao buscar associações:', error);
            return {
              ...user,
              teams: []
            };
          }

          // Mapear associações para o formato esperado
          const mappedTeams = associations.map(assoc => ({
            id: assoc.id,
            user_id: assoc.user_id,
            team_id: assoc.team_id,
            team_name: assoc.teams?.name,
            team_category: assoc.teams?.category,
            team_logo: assoc.teams?.logo
          }));

          return {
            ...user,
            teams: mappedTeams
          };
        }));

        return usersWithTeams as UserAccount[];
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
      }
    }
  });

  // Buscar todos os times para seleção
  const { data: teams = [] } = useQuery({
    queryKey: ['all-teams'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('id, name, category')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Erro ao buscar times:', error);
        return [];
      }
    }
  });

  // Mutation para criar usuário
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserPayload) => {
      // 1. Criar o usuário
      const { data: user, error } = await supabase.rpc('create_user', {
        p_name: userData.name,
        p_email: userData.email,
        p_password: userData.password,
        p_role: userData.role
      });

      if (error) throw error;

      // 2. Se for gerente de time, associar aos times selecionados
      if (userData.role === 'team_manager' && userData.teams && userData.teams.length > 0) {
        const associations = userData.teams.map(teamId => ({
          user_id: user,
          team_id: teamId
        }));

        const { error: assocError } = await supabase
          .from('user_team_associations')
          .insert(associations);

        if (assocError) throw assocError;
      }

      return user;
    },
    onSuccess: () => {
      toast({
        title: "Usuário criado com sucesso",
        description: "O usuário foi adicionado ao sistema.",
      });
      createForm.reset({
        name: '',
        email: '',
        password: generatePassword(),
        role: 'team_manager',
        teams: [],
      });
      setIsOpenCreateDialog(false);
      queryClient.invalidateQueries({ queryKey: ['app-users'] });
    },
    onError: (error) => {
      console.error('Erro ao criar usuário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    }
  });

  // Mutation para atualizar usuário
  const updateUserMutation = useMutation({
    mutationFn: async (userData: UpdateUserPayload) => {
      // 1. Atualizar dados básicos do usuário
      const updateData: any = {
        name: userData.name,
        email: userData.email,
        role: userData.role
      };

      // Se senha foi fornecida, gerar hash
      if (userData.password) {
        const { data: passwordHash } = await supabase.rpc('generate_password_hash', {
          password: userData.password
        });
        updateData.password_hash = passwordHash;
      }

      const { error } = await supabase
        .from('app_users')
        .update(updateData)
        .eq('id', userData.id);

      if (error) throw error;

      // 2. Atualizar associações com times
      if (userData.role === 'team_manager') {
        // Primeiro remover todas as associações existentes
        const { error: deleteError } = await supabase
          .from('user_team_associations')
          .delete()
          .eq('user_id', userData.id);

        if (deleteError) throw deleteError;

        // Depois adicionar as novas associações
        if (userData.teams && userData.teams.length > 0) {
          const associations = userData.teams.map(teamId => ({
            user_id: userData.id,
            team_id: teamId
          }));

          const { error: insertError } = await supabase
            .from('user_team_associations')
            .insert(associations);

          if (insertError) throw insertError;
        }
      }

      return userData.id;
    },
    onSuccess: () => {
      toast({
        title: "Usuário atualizado com sucesso",
        description: "As informações do usuário foram atualizadas.",
      });
      updateForm.reset();
      setIsOpenEditDialog(false);
      queryClient.invalidateQueries({ queryKey: ['app-users'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    }
  });

  // Mutation para excluir usuário
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return userId;
    },
    onSuccess: () => {
      toast({
        title: "Usuário excluído com sucesso",
        description: "O usuário foi removido do sistema.",
      });
      setIsOpenDeleteDialog(false);
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ['app-users'] });
    },
    onError: (error) => {
      console.error('Erro ao excluir usuário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    }
  });

  const handleCreateUser = (data: z.infer<typeof createUserSchema>) => {
    createUserMutation.mutate(data);
  };

  const handleUpdateUser = (data: z.infer<typeof updateUserSchema>) => {
    updateUserMutation.mutate(data);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const openEditDialog = (user: UserAccount) => {
    setSelectedUser(user);

    // Preparar os times selecionados
    const selectedTeams = user.teams ? user.teams.map(t => t.team_id) : [];

    updateForm.reset({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      teams: selectedTeams,
    });

    setIsOpenEditDialog(true);
  };

  const openDeleteDialog = (user: UserAccount) => {
    setSelectedUser(user);
    setIsOpenDeleteDialog(true);
  };

  const generateNewPassword = () => {
    const newPassword = generatePassword();
    createForm.setValue('password', newPassword);
  };

  const watchRole = createForm.watch('role');
  const watchUpdateRole = updateForm.watch('role');

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center text-blue-primary text-xl">
          <Users className="mr-2 h-6 w-6" />
          Gerenciamento de Usuários
        </CardTitle>
        <CardDescription>
          Gerencie usuários do sistema, definindo suas funções e permissões de acesso
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex justify-between mb-6">
          <Button 
            variant="default" 
            onClick={() => refetchUsers()}
            className="bg-slate-600 hover:bg-slate-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar Lista
          </Button>
          
          <Button onClick={() => setIsOpenCreateDialog(true)} className="bg-blue-primary hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
        
        {isLoadingUsers ? (
          <div className="flex justify-center p-8">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-primary" />
          </div>
        ) : users.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Times Gerenciados</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' : 'Responsável de Time'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.role === 'team_manager' && user.teams && user.teams.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.teams.map((team, index) => (
                            <span 
                              key={team.id} 
                              className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-md"
                              title={`${team.team_category || ''}`}
                            >
                              {team.team_name}
                              {index < user.teams!.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      ) : user.role === 'team_manager' ? (
                        <span className="text-amber-500 text-sm">Nenhum time associado</span>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => openDeleteDialog(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">Nenhum usuário encontrado.</p>
          </div>
        )}
        
        {/* Dialog de Criação de Usuário */}
        <Dialog open={isOpenCreateDialog} onOpenChange={setIsOpenCreateDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha as informações abaixo para criar um novo usuário no sistema.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateUser)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Senha" 
                            {...field} 
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={generateNewPassword}
                          title="Gerar Nova Senha"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="team_manager">Responsável de Time</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchRole === 'team_manager' && (
                  <FormField
                    control={createForm.control}
                    name="teams"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Times Gerenciados</FormLabel>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto border rounded-md p-4">
                          {teams.length > 0 ? teams.map((team) => (
                            <FormField
                              key={team.id}
                              control={createForm.control}
                              name="teams"
                              render={({ field }) => {
                                return (
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                      checked={field.value?.includes(team.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value || [], team.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== team.id
                                              )
                                            );
                                      }}
                                    />
                                    <span className="text-sm flex-1">
                                      {team.name}
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({team.category})
                                      </span>
                                    </span>
                                  </div>
                                );
                              }}
                            />
                          )) : (
                            <p className="text-sm text-gray-500">
                              Nenhum time disponível para seleção.
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setIsOpenCreateDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createUserMutation.isPending}
                    className="bg-blue-primary hover:bg-blue-700"
                  >
                    {createUserMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      'Criar Usuário'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Dialog de Edição de Usuário */}
        <Dialog open={isOpenEditDialog} onOpenChange={setIsOpenEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Atualize as informações do usuário.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(handleUpdateUser)} className="space-y-4">
                <input type="hidden" {...updateForm.register("id")} />
                
                <FormField
                  control={updateForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={updateForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={updateForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha (opcional)</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Deixe em branco para manter a senha atual" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => updateForm.setValue('password', generatePassword())}
                          title="Gerar Nova Senha"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={updateForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="team_manager">Responsável de Time</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchUpdateRole === 'team_manager' && (
                  <FormField
                    control={updateForm.control}
                    name="teams"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Times Gerenciados</FormLabel>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto border rounded-md p-4">
                          {teams.length > 0 ? teams.map((team) => (
                            <FormField
                              key={team.id}
                              control={updateForm.control}
                              name="teams"
                              render={({ field }) => {
                                return (
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                      checked={field.value?.includes(team.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value || [], team.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== team.id
                                              )
                                            );
                                      }}
                                    />
                                    <span className="text-sm flex-1">
                                      {team.name}
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({team.category})
                                      </span>
                                    </span>
                                  </div>
                                );
                              }}
                            />
                          )) : (
                            <p className="text-sm text-gray-500">
                              Nenhum time disponível para seleção.
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setIsOpenEditDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateUserMutation.isPending}
                    className="bg-blue-primary hover:bg-blue-700"
                  >
                    {updateUserMutation.isPending ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Dialog de Confirmação para Exclusão */}
        <AlertDialog open={isOpenDeleteDialog} onOpenChange={setIsOpenDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?
                <br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteUserMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Sim, excluir'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
