
// Mock API functions that return dummy data
import { Team, User } from '../types';

// Mock data
const mockTeams: Team[] = [
  {
    id: "1",
    name: "Time 1",
    description: "Descrição do Time 1",
    logoUrl: "https://example.com/logo1.jpg",
    active: true,
  },
  {
    id: "2",
    name: "Time 2",
    description: "Descrição do Time 2",
    logoUrl: "https://example.com/logo2.jpg",
    active: false,
  },
];

const mockUsers: User[] = [
  {
    id: "1",
    name: "Usuário 1",
    email: "usuario1@example.com",
  },
  {
    id: "2",
    name: "Usuário 2",
    email: "usuario2@example.com",
    teamId: "1"
  },
];

// API functions
export const getTeams = async (filter?: any): Promise<Team[]> => {
  // Apply filter if provided
  if (filter) {
    let filteredTeams = [...mockTeams];
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredTeams = filteredTeams.filter(team => 
        team.name.toLowerCase().includes(searchLower) || 
        (team.description && team.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (filter.active !== undefined) {
      filteredTeams = filteredTeams.filter(team => team.active === filter.active);
    }
    
    return Promise.resolve(filteredTeams);
  }
  
  return Promise.resolve(mockTeams);
};

export const getTeam = async (id: string): Promise<Team | undefined> => {
  return Promise.resolve(mockTeams.find(team => team.id === id));
};

export const createTeam = async (team: Omit<Team, 'id'>): Promise<Team> => {
  const newTeam: Team = {
    ...team,
    id: Math.random().toString(36).substring(2, 9),
  };
  
  mockTeams.push(newTeam);
  return Promise.resolve(newTeam);
};

export const updateTeam = async (team: Team): Promise<Team> => {
  const index = mockTeams.findIndex(t => t.id === team.id);
  if (index !== -1) {
    mockTeams[index] = team;
  }
  return Promise.resolve(team);
};

export const deleteTeam = async (id: string): Promise<void> => {
  const index = mockTeams.findIndex(team => team.id === id);
  if (index !== -1) {
    mockTeams.splice(index, 1);
  }
  return Promise.resolve();
};

export const getUsers = async (): Promise<User[]> => {
  return Promise.resolve(mockUsers);
};

export const updateUser = async (user: User): Promise<User> => {
  const index = mockUsers.findIndex(u => u.id === user.id);
  if (index !== -1) {
    mockUsers[index] = user;
  }
  return Promise.resolve(user);
};
