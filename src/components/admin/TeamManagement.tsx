import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus, Pencil, Trash2, User } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale';
import { useSearchParams } from 'react-router-dom';
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
} from "@/components/ui/alert-dialog"
import { generateRandomString } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTeam,
  updateTeam,
  deleteTeam,
  getTeams,
  getUsers,
  updateUser,
} from "@/lib/api";
import { useUser } from "@/lib/clerk-mock";
import { Team, User as UserType } from "@/types";

const teamFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do time deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().url("Por favor, insira uma URL válida.").optional().or(z.string().length(0)),
  email: z.string().email("Por favor, insira um email válido.").optional().or(z.string().length(0)),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  foundationDate: z.date().optional(),
  active: z.boolean().default(true).optional(),
  category: z.string().optional(),
  group_name: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>

const filterSchema = z.object({
  search: z.string().optional(),
  active: z.boolean().optional(),
});

type FilterValues = z.infer<typeof filterSchema>

const userFormSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
});

type UserFormValues = z.infer<typeof userFormSchema>

const TeamManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const [isEditTeamDrawerOpen, setIsEditTeamDrawerOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isLogoDeleting, setIsLogoDeleting] = useState(false);
  const [filter, setFilter] = useState<FilterValues>({
    search: searchParams.get('search') || '',
    active: searchParams.get('active') === 'true' ? true : searchParams.get('active') === 'false' ? false : undefined,
  });
  const [isUserAssignmentDialogOpen, setIsUserAssignmentDialogOpen] = useState(false);
  const [selectedTeamForUserAssignment, setSelectedTeamForUserAssignment] = useState<Team | null>(null);
  const [isTeamActive, setIsTeamActive] = useState<boolean>(true);
  const [isTeamInactive, setIsTeamInactive] = useState<boolean>(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isUserUpdating, setIsUserUpdating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isTeamCreating, setIsTeamCreating] = useState(false);
  const [isTeamUpdating, setIsTeamUpdating] = useState(false);
  const [isTeamDeleting, setIsTeamDeleting] = useState(false);
  const { user } = useUser();

  const {
    data: teams = [],
    isLoading: isTeamsLoading,
    isError: isTeamsError,
    error: teamsError,
  } = useQuery({
    queryKey: ['teams', filter],
    queryFn: () => getTeams(filter),
  });

  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  const createTeamMutation = useMutation({
    mutationFn: createTeam,
    onMutate: async (newTeam) => {
      setIsTeamCreating(true);
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData(['teams']);
      queryClient.setQueryData(['teams'], (old: Team[] = []) => [...old, { ...newTeam, id: 'temp-id' } as Team]);
      return { previousTeams };
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Time criado com sucesso.",
      })
    },
    onError: (error: any, newTeam, context: any) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao criar time: ${error?.message}`,
      })
      queryClient.setQueryData(['teams'], context.previousTeams);
    },
    onSettled: () => {
      setIsTeamCreating(false);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: updateTeam,
    onMutate: async (updatedTeam) => {
      setIsTeamUpdating(true);
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData(['teams']);
      queryClient.setQueryData(['teams'], (old: Team[] = []) =>
        old.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
      );
      return { previousTeams };
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Time atualizado com sucesso.",
      })
    },
    onError: (error: any, updatedTeam, context: any) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao atualizar time: ${error?.message}`,
      })
      queryClient.setQueryData(['teams'], context.previousTeams);
    },
    onSettled: () => {
      setIsTeamUpdating(false);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: deleteTeam,
    onMutate: async (teamId) => {
      setIsTeamDeleting(true);
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData(['teams']);
      queryClient.setQueryData(['teams'], (old: Team[] = []) => old.filter((team) => team.id !== teamId));
      return { previousTeams };
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Time deletado com sucesso.",
      })
    },
    onError: (error: any, teamId, context: any) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao deletar time: ${error?.message}`,
      })
      queryClient.setQueryData(['teams'], context.previousTeams);
    },
    onSettled: () => {
      setIsTeamDeleting(false);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onMutate: async (updatedUser) => {
      setIsUserUpdating(true);
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old: UserType[] = []) =>
        old.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      return { previousUsers };
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso.",
      })
    },
    onError: (error: any, updatedUser, context: any) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao atualizar usuário: ${error?.message}`,
      })
      queryClient.setQueryData(['users'], context.previousUsers);
    },
    onSettled: () => {
      setIsUserUpdating(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      websiteUrl: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      foundationDate: undefined,
      active: true,
      category: "SUB-15",
      group_name: "Grupo A"
    },
    mode: "onChange",
  })

  const userAssignmentForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userId: "",
      teamId: "",
    },
    mode: "onChange",
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(prev => ({ ...prev, search: value }));
    setSearchParams(prev => {
      prev.set('search', value);
      return prev;
    });
  };

  const handleActiveFilterChange = (value: boolean | undefined) => {
    setFilter(prev => ({ ...prev, active: value }));
    setSearchParams(prev => {
      if (value !== undefined) {
        prev.set('active', String(value));
      } else {
        prev.delete('active');
      }
      return prev;
    });
  };

  const onSubmit = async (values: TeamFormValues) => {
    try {
      if (selectedTeam) {
        const updatedTeam = { ...selectedTeam, ...values } as Team;
        if (logoFile) {
          setIsLogoUploading(true);
          updatedTeam.logoUrl = `https://example.com/logos/${logoFile.name}`;
        }
        await updateTeamMutation.mutateAsync(updatedTeam);
      } else {
        const newTeam = { 
          ...values, 
          active: values.active ?? true,
          category: values.category || "SUB-15",
          group_name: values.group_name || "Grupo A"
        } as Omit<Team, 'id'>;
        if (logoFile) {
          setIsLogoUploading(true);
          newTeam.logoUrl = `https://example.com/logos/${logoFile.name}`;
        }
        await createTeamMutation.mutateAsync(newTeam);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: selectedTeam ? `Erro ao atualizar time: ${error?.message}` : `Erro ao criar time: ${error?.message}`,
      })
    } finally {
      setIsLogoUploading(false);
      setLogoFile(null);
      form.reset();
      setSelectedTeam(null);
      setIsNewTeamDialogOpen(false);
      setIsEditTeamDrawerOpen(false);
    }
  }

  const onUserAssignmentSubmit = async (values: UserFormValues) => {
    try {
      setIsUserLoading(true);
      const userToUpdate = users.find(user => user.id === values.userId);

      if (!userToUpdate) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Usuário não encontrado.",
        });
        return;
      }

      if (userToUpdate.teamId) {
        toast({
          variant: "default",
          title: "Atenção",
          description: "Este time já possui um usuário associado."
        });
        return;
      }

      const updatedUser = { ...userToUpdate, teamId: values.teamId };
      await updateUserMutation.mutateAsync(updatedUser);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao atribuir usuário ao time: ${error?.message}`,
      })
    } finally {
      setIsUserLoading(false);
      userAssignmentForm.reset();
      setSelectedTeamForUserAssignment(null);
      setIsUserAssignmentDialogOpen(false);
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      form.setValue("logoUrl", file.name);
    }
  };

  const handleRemoveLogo = async () => {
    if (selectedTeam?.logoUrl) {
      setIsLogoDeleting(true);
      try {
        const updatedTeam = { ...selectedTeam, logoUrl: undefined } as Team;
        await updateTeamMutation.mutateAsync(updatedTeam);
        toast({
          title: "Sucesso",
          description: "Logo removido com sucesso.",
        })
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: `Erro ao remover logo: ${error?.message}`,
        })
      } finally {
        setIsLogoDeleting(false);
        form.setValue("logoUrl", "");
      }
    }
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    form.reset({
      name: team.name,
      description: team.description || "",
      logoUrl: team.logoUrl || "",
      websiteUrl: team.websiteUrl || "",
      email: team.email || "",
      phone: team.phone || "",
      address: team.address || "",
      city: team.city || "",
      state: team.state || "",
      country: team.country || "",
      foundationDate: team.foundationDate ? new Date(team.foundationDate) : undefined,
      active: team.active,
      category: team.category || "SUB-15",
      group_name: team.group_name || "Grupo A"
    });
    setIsEditTeamDrawerOpen(true);
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeamMutation.mutateAsync(teamId);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao deletar time: ${error?.message}`,
      })
    }
  };

  const handleAssignUser = (team: Team) => {
    setSelectedTeamForUserAssignment(team);
    userAssignmentForm.setValue("teamId", team.id);
    setIsUserAssignmentDialogOpen(true);
  };

  const handleTeamActiveChange = async (team: Team, active: boolean) => {
    try {
      const updatedTeam = { ...team, active } as Team;
      await updateTeamMutation.mutateAsync(updatedTeam);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao atualizar time: ${error?.message}`,
      })
    }
  };

  if (isTeamsLoading) return <p>Carregando times...</p>
  if (isTeamsError) return <p>Erro ao carregar times: {String(teamsError)}</p>
  if (isUsersLoading) return <p>Carregando usuários...</p>
  if (isUsersError) return <p>Erro ao carregar usuários: {String(usersError)}</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Times</h2>
        <Button onClick={() => setIsNewTeamDialogOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Adicionar Time
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          type="text"
          placeholder="Buscar time..."
          value={filter.search || ''}
          onChange={handleSearchChange}
        />
        <div className="flex items-center space-x-2">
          <Label htmlFor="active-teams">Mostrar times ativos:</Label>
          <Switch
            id="active-teams"
            checked={filter.active === true || filter.active === undefined}
            onCheckedChange={(checked) => handleActiveFilterChange(checked ? undefined : false)}
          />
          <Label htmlFor="inactive-teams">Mostrar times inativos:</Label>
          <Switch
            id="inactive-teams"
            checked={filter.active === false || filter.active === undefined}
            onCheckedChange={(checked) => handleActiveFilterChange(checked ? undefined : true)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  {team.logoUrl ? (
                    <Avatar>
                      <AvatarImage src={team.logoUrl} alt={team.name} />
                      <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell>
                  <Switch
                    checked={team.active}
                    onCheckedChange={(checked) => handleTeamActiveChange(team, checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleEditTeam(team)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar time</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleAssignUser(team)}>
                            <User className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Atribuir usuário</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação irá deletar o time permanentemente. Tem certeza que deseja continuar?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTeam(team.id)}>Deletar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Deletar time</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isNewTeamDialogOpen} onOpenChange={setIsNewTeamDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hidden">Abrir Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar novo time</DialogTitle>
            <DialogDescription>
              Crie um novo time para gerenciar no sistema.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          id="logo-upload"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <Label htmlFor="logo-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                          {logoFile ? logoFile.name : "Selecionar Logo"}
                        </Label>
                        {logoFile && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setLogoFile(null);
                              form.setValue("logoUrl", "");
                            }}
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="URL do website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Estado do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="País do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="foundationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fundação</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" side="bottom">
                        <Calendar
                          mode="single"
                          locale={ptBR}
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Ativo</FormLabel>
                      <FormDescription>
                        Determina se o time está ativo no sistema
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isTeamCreating ? (
                  <>
                    Criando...
                    <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  </>
                ) : "Criar Time"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Drawer open={isEditTeamDrawerOpen} onOpenChange={setIsEditTeamDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="hidden">Abrir Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="p-4 max-w-md mx-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Time</DrawerTitle>
            <DrawerDescription>
              Edite as informações do time.
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          id="logo-upload-edit"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <Label htmlFor="logo-upload-edit" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                          {logoFile ? logoFile.name : selectedTeam?.logoUrl ? "Alterar Logo" : "Selecionar Logo"}
                        </Label>
                        {(logoFile || selectedTeam?.logoUrl) && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (selectedTeam?.logoUrl && !logoFile) {
                                handleRemoveLogo();
                              } else {
                                setLogoFile(null);
                                form.setValue("logoUrl", selectedTeam?.logoUrl || "");
                              }
                            }}
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="URL do website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone do time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Ativo</FormLabel>
                      <FormDescription>
                        Determina se o time está ativo no sistema
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isTeamUpdating ? (
                  <>
                    Atualizando...
                    <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  </>
                ) : "Atualizar Time"}
              </Button>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>

      <Dialog open={isUserAssignmentDialogOpen} onOpenChange={setIsUserAssignmentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atribuir Usuário ao Time</DialogTitle>
            <DialogDescription>
              Selecione um usuário para vincular a este time.
            </DialogDescription>
          </DialogHeader>
          <Form {...userAssignmentForm}>
            <form onSubmit={userAssignmentForm.handleSubmit(onUserAssignmentSubmit)} className="space-y-4">
              <FormField
                control={userAssignmentForm.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um usuário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.filter(user => !user.teamId).map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name || user.email || 'Usuário sem nome'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isUserLoading}>
                {isUserLoading ? (
                  <>
                    Atribuindo...
                    <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  </>
                ) : "Atribuir Usuário"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
