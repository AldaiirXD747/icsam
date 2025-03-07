
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, UserPlus, Search, Filter, Trash2, Mail, Shield, Edit } from "lucide-react";
import { getUsers, getTeams, updateUser } from "@/lib/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form schema for creating/inviting new users
const userFormSchema = z.object({
  email: z.string().email({
    message: "Por favor, forneça um email válido.",
  }),
  role: z.enum(["admin", "team_manager", "user"], {
    required_error: "Por favor, selecione um papel para o usuário.",
  }),
  teamId: z.string().optional(),
});

// Schema for user filtering
const filterSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;
type FilterValues = z.infer<typeof filterSchema>;

type Role = "admin" | "team_manager" | "user";

interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  role: Role;
  teamId?: string;
  teamName?: string;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
}

// Mock data - in a real app, this would come from the API
const mockUsers: ExtendedUser[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Administrador Principal",
    role: "admin",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    avatarUrl: "https://ui-avatars.com/api/?name=Admin&background=1a237e&color=fff"
  },
  {
    id: "2",
    email: "coach@teamone.com",
    name: "Técnico Time Um",
    role: "team_manager",
    teamId: "team1",
    teamName: "Time Um",
    isActive: true,
    createdAt: "2023-02-15T00:00:00Z",
    avatarUrl: "https://ui-avatars.com/api/?name=Coach&background=2196f3&color=fff"
  },
  {
    id: "3",
    email: "manager@teamtwo.com",
    name: "Gerente Time Dois",
    role: "team_manager",
    teamId: "team2",
    teamName: "Time Dois",
    isActive: true,
    createdAt: "2023-03-20T00:00:00Z", 
    avatarUrl: "https://ui-avatars.com/api/?name=Manager&background=4caf50&color=fff"
  },
  {
    id: "4",
    email: "inactive@example.com",
    role: "user",
    isActive: false,
    createdAt: "2023-04-10T00:00:00Z",
    avatarUrl: "https://ui-avatars.com/api/?name=Inactive&background=9e9e9e&color=fff"
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState<ExtendedUser[]>(mockUsers);
  const [filter, setFilter] = useState<FilterValues>({
    search: "",
    role: "",
    isActive: undefined,
  });
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");

  // Fetch teams for the dropdown when assigning a team to a user
  const {
    data: teams = [],
    isLoading: isTeamsLoading,
  } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams({}),
  });

  // Set up the form for inviting new users
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      role: "user",
      teamId: undefined,
    },
  });

  // Setup the form for editing users
  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      role: "user",
      teamId: undefined,
    },
  });

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Filter by search term
    if (filter.search && !user.email.toLowerCase().includes(filter.search.toLowerCase()) && 
        !user.name?.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    // Filter by role
    if (filter.role && user.role !== filter.role) {
      return false;
    }
    
    // Filter by active status
    if (filter.isActive !== undefined && user.isActive !== filter.isActive) {
      return false;
    }
    
    return true;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, search: e.target.value }));
  };

  const handleRoleFilterChange = (role: string) => {
    setFilter(prev => ({ ...prev, role: role === "all" ? "" : role as Role }));
  };

  const handleActiveFilterChange = (isActive: boolean | undefined) => {
    setFilter(prev => ({ ...prev, isActive }));
  };

  const handleInviteUser = (values: UserFormValues) => {
    // In a real app, this would call an API to send an invitation
    const newUser: ExtendedUser = {
      id: Math.random().toString(36).substring(7),
      email: values.email,
      role: values.role,
      teamId: values.teamId,
      teamName: values.teamId ? teams.find(team => team.id === values.teamId)?.name : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://ui-avatars.com/api/?name=${values.email.charAt(0)}&background=1a237e&color=fff`
    };
    
    setUsers(prev => [...prev, newUser]);
    
    toast({
      title: "Convite enviado",
      description: `Um convite foi enviado para ${values.email}.`,
    });
    
    form.reset();
    setIsInviteDialogOpen(false);
  };

  const handleEditUser = (values: UserFormValues) => {
    if (!selectedUser) return;
    
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          email: values.email,
          role: values.role,
          teamId: values.teamId,
          teamName: values.teamId ? teams.find(team => team.id === values.teamId)?.name : undefined,
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    toast({
      title: "Usuário atualizado",
      description: `As informações do usuário foram atualizadas com sucesso.`,
    });
    
    editForm.reset();
    setSelectedUser(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso.",
    });
  };

  const handleToggleUserActive = (userId: string, isActive: boolean) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isActive };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    toast({
      title: isActive ? "Usuário ativado" : "Usuário desativado",
      description: `O usuário foi ${isActive ? "ativado" : "desativado"} com sucesso.`,
    });
  };

  const handleEditClick = (user: ExtendedUser) => {
    setSelectedUser(user);
    editForm.reset({
      email: user.email,
      role: user.role,
      teamId: user.teamId,
    });
    setIsEditDialogOpen(true);
  };

  const renderRoleBadge = (role: Role) => {
    switch(role) {
      case "admin":
        return <Badge className="bg-red-500">Administrador</Badge>;
      case "team_manager":
        return <Badge className="bg-blue-500">Gerente de Time</Badge>;
      case "user":
        return <Badge className="bg-green-500">Usuário</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Usuários</h2>
          <p className="text-gray-500 mt-1">Gerencie usuários e permissões do sistema</p>
        </div>
        <Button 
          onClick={() => setIsInviteDialogOpen(true)} 
          className="flex items-center gap-2"
        >
          <UserPlus size={16} />
          Convidar Usuário
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="invites">Convites Pendentes</TabsTrigger>
          <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={filter.search || ''}
                    onChange={handleSearchChange}
                    className="pl-8"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select onValueChange={handleRoleFilterChange} defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os papéis</SelectItem>
                      <SelectItem value="admin">Administradores</SelectItem>
                      <SelectItem value="team_manager">Gerentes de Time</SelectItem>
                      <SelectItem value="user">Usuários</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter size={16} />
                        Mais Filtros
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <h4 className="font-medium">Filtrar por status</h4>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="active-users">Usuários ativos</Label>
                            <Switch
                              id="active-users"
                              checked={filter.isActive === true || filter.isActive === undefined}
                              onCheckedChange={(checked) => handleActiveFilterChange(checked ? undefined : false)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="inactive-users">Usuários inativos</Label>
                            <Switch
                              id="inactive-users"
                              checked={filter.isActive === false || filter.isActive === undefined}
                              onCheckedChange={(checked) => handleActiveFilterChange(checked ? undefined : true)}
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Avatar</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Nenhum usuário encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
                            <AvatarFallback>{user.name?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{user.name || "Sem nome"}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </TableCell>
                        <TableCell>{renderRoleBadge(user.role)}</TableCell>
                        <TableCell>{user.teamName || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "outline" : "destructive"}>
                            {user.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={(checked) => handleToggleUserActive(user.id, checked)}
                            />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remover usuário</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Convites Pendentes</CardTitle>
              <CardDescription>
                Gerencie os convites que ainda não foram aceitos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Nenhum convite pendente</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Todos os convites foram aceitos ou você ainda não convidou ninguém.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsInviteDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Convidar Usuário
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Visualize todas as ações recentes dos usuários no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Sem atividades recentes</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Não há registros de atividades recentes no sistema.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for inviting new users */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Novo Usuário</DialogTitle>
            <DialogDescription>
              Envie um convite para um novo usuário entrar no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleInviteUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="exemplo@dominio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Papel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um papel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="team_manager">Gerente de Time</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("role") === "team_manager" && (
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button type="submit">Enviar Convite</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog for editing users */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Modifique as informações e permissões do usuário.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="exemplo@dominio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Papel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um papel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="team_manager">Gerente de Time</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {editForm.watch("role") === "team_manager" && (
                <FormField
                  control={editForm.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
