
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AdminNav from '@/components/admin/AdminNav';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <AdminNav />
        <div className="flex-1 p-4 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
