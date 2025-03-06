<lov-code>
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Plus, Pencil, Trash2, User, Mail, Lock, ImagePlus, ShieldCheck } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from 'date-fns/locale';
import { DatePicker } from "@/components/date-picker"
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton"
import { Label as ShadLabel } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input as ShadInput } from "@/components/ui/input"
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSeparator,
} from "@/components/ui/resizable"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Slider } from "@/components/ui/slider"
import { Switch as ShadSwitch } from "@/components/ui/switch"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Separator as ShadSeparator } from "@/components/ui/separator"
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress as ShadProgress } from "@/components/ui/progress"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Calendar as ShadCalendar } from "@/components/ui/calendar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { generateRandomString } from "@/lib/utils";
import { Check, Copy, MoreHorizontal, Share2 } from "lucide-react"
import * as Collapsible from "@radix-ui/react-collapsible"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTeam as createTeamAPI,
  updateTeam as updateTeamAPI,
  deleteTeam as deleteTeamAPI,
  getTeams as getTeamsAPI,
  getTeam as getTeamAPI,
  getUsers as getUsersAPI,
  updateUser as updateUserAPI,
} from "@/lib/api";
import { useUser } from "@clerk/clerk-react";

const teamFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do time deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().url("Por favor, insira uma URL válida.").optional(),
  email: z.string().email("Por favor, insira um email válido.").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  foundationDate: z.date().optional(),
  active: z.boolean().default(true).optional(),
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isTeamCreating, setIsTeamCreating] = useState(false);
  const [isTeamUpdating, setIsTeamUpdating] = useState(false);
  const [isTeamDeleting, setIsTeamDeleting] = useState(false);
  const { user } = useUser();

  const {
    data: teams,
    isLoading: isTeamsLoading,
    isError: isTeamsError,
    error: teamsError,
  } = useQuery({
    queryKey: ['teams', filter],
    queryFn: () => getTeamsAPI(filter),
  });

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsersAPI(),
  });

  const createTeam = useMutation({
    mutationFn: createTeamAPI,
    onMutate: async (newTeam) => {
      setIsTeamCreating(true);
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData<Team[]>(['teams']);
      queryClient.setQueryData(['teams'], (old) => [...(old || []), newTeam]);
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

  const updateTeam = useMutation({
    mutationFn: updateTeamAPI,
    onMutate: async (updatedTeam) => {
      setIsTeamUpdating(true);
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData<Team[]>(['teams']);
      queryClient.setQueryData(['teams'], (old) =>
        old?.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
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

  const deleteTeam = useMutation({
    mutationFn: deleteTeamAPI,
    onMutate: async (teamId) => {
      setIsTeamDeleting(true);
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      const previousTeams = queryClient.getQueryData<Team[]>(['teams']);
      queryClient.setQueryData(['teams'], (old) => old?.filter((team) => team.id !== teamId));
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

  const updateUser = useMutation({
    mutationFn: updateUserAPI,
    onMutate: async (updatedUser) => {
      setIsUserUpdating(true);
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<User[]>(['users']);
      queryClient.setQueryData(['users'], (old) =>
        old?.map((user) => (user.id === updatedUser.id ? updatedUser : user))
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
        // Update Team
        const updatedTeam = { ...selectedTeam, ...values };
        if (logoFile) {
          setIsLogoUploading(true);
          const logoRef = ref(storage, `team-logos/${logoFile.name}-${generateRandomString(16)}`);
          const snapshot = await uploadBytes(logoRef, logoFile);
          const logoURL = await getDownloadURL(snapshot.ref);
          updatedTeam.logoUrl = logoURL;
        }
        await updateTeam.mutateAsync(updatedTeam);
      } else {
        // Create Team
        if (logoFile) {
          setIsLogoUploading(true);
          const logoRef = ref(storage, `team-logos/${logoFile.name}-${generateRandomString(16)}`);
          const snapshot = await uploadBytes(logoRef, logoFile);
          const logoURL = await getDownloadURL(snapshot.ref);
          values.logoUrl = logoURL;
        }
        await createTeam.mutateAsync(values);
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
      const userToUpdate = users?.find(user => user.id === values.userId);

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
      await updateUser.mutateAsync(updatedUser);
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
        const logoRef = ref(storage, selectedTeam.logoUrl);
        await deleteObject(logoRef);
        const updatedTeam = { ...selectedTeam, logoUrl: null };
        await updateTeam.mutateAsync(updatedTeam);
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
    });
    setIsEditTeamDrawerOpen(true);
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam.mutateAsync(teamId);
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
      const updatedTeam = { ...team, active: active };
      await updateTeam.mutateAsync(updatedTeam);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao atualizar time: ${error?.message}`,
      })
    }
  };

  if (isTeamsLoading) return <p>Carregando times...</p>
  if (isTeamsError) return <p>Erro ao carregar times: {teamsError?.message}</p>
  if (isUsersLoading) return <p>Carregando usuários...</p>
  if (isUsersError) return <p>Erro ao carregar usuários: {usersError?.message}</p>

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
            {teams?.map((team) => (
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
                  <ShadSwitch
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
          <Button variant="outline">Abrir Dialog</Button>
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
                      <PopoverContent className="w-auto p-0" align="center" side="bottom">
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
          <Button variant="outline">Abrir Drawer</Button>
        </DrawerTrigger>
        <DrawerContent className="sm:max-w-[425px]">
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
