
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Trophy, CalendarDays, Users, BarChart2, Camera, Database, Medal, Award, ShieldAlert } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const sidebarLinks = [
    { 
      name: "Campeonatos", 
      path: "/admin/championships",
      icon: <Trophy className="w-5 h-5" />
    },
    { 
      name: "Times", 
      path: "/admin/teams",
      icon: <Users className="w-5 h-5" />
    },
    { 
      name: "Jogos", 
      path: "/admin/matches",
      icon: <CalendarDays className="w-5 h-5" />
    },
    { 
      name: "Classificação", 
      path: "/admin/standings",
      icon: <Medal className="w-5 h-5" />
    },
    { 
      name: "Estatísticas", 
      path: "/admin/statistics",
      icon: <BarChart2 className="w-5 h-5" />
    },
    { 
      name: "Artilharia", 
      path: "/admin/statistics/top-scorers",
      icon: <Award className="w-5 h-5" />
    },
    { 
      name: "Cartões", 
      path: "/admin/statistics/yellow-cards",
      icon: <ShieldAlert className="w-5 h-5" />
    },
    { 
      name: "Galeria", 
      path: "/admin/gallery",
      icon: <Camera className="w-5 h-5" />
    },
    { 
      name: "Sincronização", 
      path: "/admin/sync",
      icon: <Database className="w-5 h-5" />
    }
  ];

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 h-full bg-[#1a237e] text-white transition-all duration-300 z-20",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-blue-800 flex items-center justify-center">
          {isOpen ? (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-bold">AP</h1>
          )}
        </div>
        
        <nav className="flex-grow p-2">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-colors hover:bg-blue-800",
                    location.pathname === link.path && "bg-blue-800",
                    !isOpen && "justify-center"
                  )}
                >
                  {link.icon}
                  {isOpen && <span className="ml-3">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
