
import React, { useState, useEffect } from 'react';
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
import { Plus, Pencil, Trash2, User, Filter, Search, UsersRound, BarChart4 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTeam,
  updateTeam,
  deleteTeam,
  getTeams,
  getTeam,
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
  category: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>

const userFormSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
});

type UserFormValues = z.infer<typeof userFormSchema>

const categories = [
  "SUB-9",
  "SUB-11", 
  "SUB-13",
  "SUB-15", 
  "SUB-17", 
  "SUB-20", 
  "Adulto",
  "Master",
  "Veterano"
];

const TeamManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("teams");
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const [isEditTeamDrawerOpen, setIsEditTeamDrawerOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>(searchParams.get('category') || "Todas");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isLogoDeleting, setIsLogoDeleting] = useState(false);
  const [filter, setFilter] = useState<FilterValues>({
    search: searchParams.get('search') || '',
    active: searchParams.get('active') === 'true' ? true : searchParams.get('active') === 'false' ? false : undefined,
    category: searchParams.get('category') || '',
  });
  const [isUserAssignmentDialogOpen, setIsUserAssignmentDialogOpen] = useState(false);
  const [selectedTeamForUserAssignment, setSelectedTeamForUserAssignment] = useState<Team | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isUserUpdating, setIsUserUpdating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isTeamCreating, setIsTeamCreating] = useState(false);
  const [isTeamUpdating, setIsTeamUpdating] = useState(false);
  const [isTeamDeleting, setIsTeamDeleting] = useState(false);
  const [isTeamDetailOpen, setIsTeamDetailOpen] = useState(false);
  const [activeTeamDetailTab, setActiveTeamDetailTab] = useState("profile");
  const { user } = useUser();
  const isMobile = window.innerWidth < 768;

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

  const filteredTeams = currentCategory === "Todas" 
    ? teams 
    : teams.filter(team => team.category === currentCategory);

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

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    if (category === "Todas") {
      setFilter(prev => ({ ...prev, category: '' }));
      setSearchParams(prev => {
        prev.delete('category');
        return prev;
      });
    } else {
      setFilter(prev => ({ ...prev, category }));
      setSearchParams(prev => {
        prev.set('category', category);
        return prev;
      });
    }
  };

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
        const updatedTeam = { 
          ...selectedTeam, 
          ...values,
          foundationDate: values.foundationDate ? values.foundationDate.toISOString().split('T')[0] : undefined
        } as Team;
        
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
          group_name: values.group_name || "Grupo A",
          foundationDate: values.foundationDate ? values.foundationDate.toISOString().split('T')[0] : undefined
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

  const handleViewTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    setIsTeamDetailOpen(true);
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Times</h2>
        <Button onClick={() => setIsNewTeamDialogOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Adicionar Time
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto p-2 border rounded-md bg-white">
          <Badge 
            variant={currentCategory === "Todas" ? "default" : "outline"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => handleCategoryChange("Todas")}
          >
            Todas
          </Badge>
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={currentCategory === category ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar time..."
              value={filter.search || ''}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter size={16} />
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filtrar por status</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active-teams">Times ativos</Label>
                      <Switch
                        id="active-teams"
                        checked={filter.active === true || filter.active === undefined}
                        onCheckedChange={(checked) => handleActiveFilterChange(checked ? undefined : false)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="inactive-teams">Times inativos</Label>
                      <Switch
                        id="inactive-teams"
                        checked={filter.active === false || filter.active === undefined}
                        onCheckedChange={(checked) => handleActiveFilterChange(checked ? undefined : true)}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <UsersRound className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium">Nenhum time encontrado</h3>
            <p className="text-gray-500 mt-2 text-center">
              Não há times para exibir com os filtros atuais. Tente alterar os filtros ou adicione um novo time.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsNewTeamDialogOpen(true)}
            >
              <Plus size={16} className="mr-2" />
              Adicionar novo time
            </Button>
          </CardContent>
        </Card>
      ) : isMobile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  {team.logoUrl ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={team.logoUrl} alt={team.name} />
                      <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{team.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <CardTitle className="text-base">{team.name}</CardTitle>
                    <CardDescription className="text-xs">{team.category}</CardDescription>
                  </div>
                </div>
                <Switch
                  checked={team.active}
                  onCheckedChange={(checked) => handleTeamActiveChange(team, checked)}
                  className="ml-2"
                />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Grupo:</span> {team.group_name}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-2 flex justify-between border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewTeamDetails(team)}
                >
                  Detalhes
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditTeam(team)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
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
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">Logo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleViewTeamDetails(team)}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
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
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.category}</TableCell>
                  <TableCell>{team.group_name}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={team.active}
                      onCheckedChange={(checked) => handleTeamActiveChange(team, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-2">
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
      )}

      {/* Team Detail Drawer */}
      <Drawer open={isTeamDetailOpen} onOpenChange={setIsTeamDetailOpen}>
        <DrawerContent className="p-0 max-h-[90vh]">
          <DrawerHeader className="px-4 py-3 border-b">
            <DrawerTitle className="flex items-center gap-3">
              {selectedTeam?.logoUrl ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedTeam.logoUrl} alt={selectedTeam.name} />
                  <AvatarFallback>{selectedTeam?.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{selectedTeam?.name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              {selectedTeam?.name}
            </DrawerTitle>
            <DrawerDescription>
              {selectedTeam?.category} - {selectedTeam?.group_name}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 py-2 border-b">
            <Tabs value={activeTeamDetailTab} onValueChange={setActiveTeamDetailTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="players">Jogadores</TabsTrigger>
                <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            <TabsContent value="profile" className="mt-0">
              {selectedTeam && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Nome</Label>
                      <p className="font-medium">{selectedTeam.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Categoria</Label>
                      <p className="font-medium">{selectedTeam.category}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Grupo</Label>
                      <p className="font-medium">{selectedTeam.group_name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Status</Label>
                      <p className="font-medium">
                        <Badge variant={selectedTeam.active ? "default" : "destructive"}>
                          {selectedTeam.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </p>
                    </div>
                    {selectedTeam.foundationDate && (
                      <div>
                        <Label className="text-xs text-gray-500">Data de Fundação</Label>
                        <p className="font-medium">{format(new Date(selectedTeam.foundationDate), "dd/MM/yyyy")}</p>
                      </div>
                    )}
                    {selectedTeam.description && (
                      <div className="col-span-2">
                        <Label className="text-xs text-gray-500">Descrição</Label>
                        <p>{selectedTeam.description}</p>
                      </div>
                    )}
                    {selectedTeam.email && (
                      <div>
                        <Label className="text-xs text-gray-500">Email</Label>
                        <p className="font-medium">{selectedTeam.email}</p>
                      </div>
                    )}
                    {selectedTeam.phone && (
                      <div>
                        <Label className="text-xs text-gray-500">Telefone</Label>
                        <p className="font-medium">{selectedTeam.phone}</p>
                      </div>
                    )}
                    {selectedTeam.websiteUrl && (
                      <div className="col-span-2">
                        <Label className="text-xs text-gray-500">Website</Label>
                        <p className="font-medium text-blue-600 hover:underline">
                          <a href={selectedTeam.websiteUrl} target="_blank" rel="noopener noreferrer">
                            {selectedTeam.websiteUrl}
                          </a>
                        </p>
                      </div>
                    )}
                    {(selectedTeam.address || selectedTeam.city || selectedTeam.state || selectedTeam.country) && (
                      <div className="col-span-2">
                        <Label className="text-xs text-gray-500">Endereço</Label>
                        <p>
                          {[
                            selectedTeam.address,
                            selectedTeam.city,
                            selectedTeam.state,
                            selectedTeam.country
                          ].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsTeamDetailOpen(false)}>
                      Fechar
                    </Button>
                    <Button onClick={() => {
                      setIsTeamDetailOpen(false);
                      handleEditTeam(selectedTeam);
                    }}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="players" className="mt-0">
              <div className="text-center py-8">
                {selectedTeam && (
                  <div className="flex flex-col items-center">
                    <UsersRound className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Gerenciar Jogadores</h3>
                    <p className="text-gray-500 mb-4">Visualize e gerencie os jogadores do time {selectedTeam.name}</p>
                    <Button onClick={() => {
                      setIsTeamDetailOpen(false);
                      // Navigate to the player management page for this team
                      window.location.href = `/admin/teams/${selectedTeam.id}/players`;
                    }}>
                      Ir para Gerenciamento de Jogadores
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="statistics" className="mt-0">
              <div className="text-center py-8">
                {selectedTeam && (
                  <div className="flex flex-col items-center">
                    <BarChart4 className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Estatísticas do Time</h3>
                    <p className="text-gray-500 mb-4">Visualize estatísticas detalhadas do time {selectedTeam.name}</p>
                    <Button onClick={() => {
                      setIsTeamDetailOpen(false);
                      // Navigate to the team statistics page
                      window.location.href = `/admin/teams/${selectedTeam.id}/statistics`;
                    }}>
                      Ir para Estatísticas
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
          
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Grupo A">Grupo A</SelectItem>
                        <SelectItem value="Grupo B">Grupo B</SelectItem>
                        <SelectItem value="Grupo C">Grupo C</SelectItem>
                        <SelectItem value="Grupo D">Grupo D</SelectItem>
                      </SelectContent>
                    </Select>
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
              <div className="grid grid-cols-2 gap-4">
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
              </div>
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
                              "w-full pl-3 text-left font-normal",
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
              <Button type="submit" className="w-full">
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Grupo A">Grupo A</SelectItem>
                        <SelectItem value="Grupo B">Grupo B</SelectItem>
                        <SelectItem value="Grupo C">Grupo C</SelectItem>
                        <SelectItem value="Grupo D">Grupo D</SelectItem>
                      </SelectContent>
                    </Select>
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
              <div className="grid grid-cols-2 gap-4">
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
              </div>
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
                              "w-full pl-3 text-left font-normal",
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
              <Button type="submit" className="w-full">
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
              <Button type="submit" disabled={isUserLoading} className="w-full">
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
