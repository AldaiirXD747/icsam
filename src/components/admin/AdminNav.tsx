
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Calendar, 
  Table2, 
  BarChart3, 
  Image, 
  FileText, 
  FileCode2,
  Database,
  RefreshCcw
} from 'lucide-react';

const AdminNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-6 text-blue-primary">Admin Panel</h2>
      
      <nav className="space-y-1">
        <Link 
          to="/admin" 
          className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin')}`}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </Link>
        
        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
            Championship
          </p>
          
          <Link 
            to="/admin/standings" 
            className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/standings')}`}
          >
            <Trophy className="w-5 h-5 mr-3" />
            <span>Standings</span>
          </Link>
          
          <Link 
            to="/admin/teams" 
            className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/teams')}`}
          >
            <Users className="w-5 h-5 mr-3" />
            <span>Teams</span>
          </Link>
          
          <Link 
            to="/admin/matches" 
            className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/matches')}`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            <span>Matches</span>
          </Link>
          
          <Link 
            to="/admin/players" 
            className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/players')}`}
          >
            <Table2 className="w-5 h-5 mr-3" />
            <span>Players</span>
          </Link>
          
          <Link 
            to="/admin/statistics" 
            className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/statistics')}`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            <span>Statistics</span>
          </Link>
        </div>
        
        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
            Content
          </p>
          
          <Link 
            to="/admin/gallery" 
            className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/gallery')}`}
          >
            <Image className="w-5 h-5 mr-3" />
            <span>Gallery</span>
          </Link>
          
          <Link 
            to="/admin/transparency" 
            className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/transparency')}`}
          >
            <FileText className="w-5 h-5 mr-3" />
            <span>Transparency</span>
          </Link>
        </div>

        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase mb-2">
            Development
          </p>
          
          <Link 
            to="/admin/database-cleanup" 
            className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/database-cleanup')}`}
          >
            <Database className="w-5 h-5 mr-3" />
            <span>Database Cleanup</span>
          </Link>
          
          <Link 
            to="/admin/load-base-forte" 
            className={`flex items-center px-4 py-2 rounded-md ${isActive('/admin/load-base-forte')}`}
          >
            <RefreshCcw className="w-5 h-5 mr-3" />
            <span>Load Base Forte Data</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default AdminNav;
