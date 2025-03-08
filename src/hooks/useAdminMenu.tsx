import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  Users,
  Settings,
  ListPlus
} from 'lucide-react';

export const useAdminMenu = () => {
  const location = useLocation();

  const isActive = (regex: RegExp): boolean => {
    return regex.test(location.pathname);
  };

  const menuItems = useMemo(() => [
    {
      text: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard />,
      activeRegex: /^\/admin$/
    },
    {
      text: 'Gerenciar Partidas',
      href: '/admin/matches',
      icon: <ListChecks />,
      activeRegex: /^\/admin\/matches/
    },
    {
      text: 'Gerenciar Times',
      href: '/admin/teams',
      icon: <Users />,
      activeRegex: /^\/admin\/teams/
    },
    {
      text: 'Gerenciar Classificação',
      href: '/admin/standings',
      icon: <Settings />,
      activeRegex: /^\/admin\/standings/
    },
    {
      text: 'Adicionar Resultados',
      href: '/admin/add-match-data',
      icon: <ListPlus />,
      activeRegex: /^\/admin\/add-match-data/
    },
  ], [location.pathname]);

  return { menuItems, isActive };
};

export default useAdminMenu;
