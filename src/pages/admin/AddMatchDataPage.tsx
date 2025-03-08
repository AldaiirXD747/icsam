
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import AddMatchData from '@/components/admin/AddMatchData';

const AddMatchDataPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Resultados</h1>
        <AddMatchData />
      </div>
    </AdminLayout>
  );
};

export default AddMatchDataPage;
