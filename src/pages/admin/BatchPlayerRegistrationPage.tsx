
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import BatchPlayerRegistration from '@/components/admin/BatchPlayerRegistration';

const BatchPlayerRegistrationPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Cadastro em Lote de Jogadores</h1>
        <BatchPlayerRegistration />
      </div>
    </AdminLayout>
  );
};

export default BatchPlayerRegistrationPage;
