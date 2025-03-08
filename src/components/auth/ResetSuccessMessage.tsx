
import React from 'react';

interface ResetSuccessMessageProps {
  show: boolean;
}

const ResetSuccessMessage: React.FC<ResetSuccessMessageProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6">
      Sua senha foi redefinida com sucesso. Por favor, faça login com sua nova senha.
    </div>
  );
};

export default ResetSuccessMessage;
