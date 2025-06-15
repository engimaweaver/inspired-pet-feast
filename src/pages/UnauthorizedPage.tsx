
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { Shield, Home, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const buttons = [
    {
      label: 'Go Home',
      onClick: () => navigate('/'),
      icon: <Home className="h-4 w-4" />
    },
    {
      label: 'Go Back',
      onClick: () => navigate(-1),
      variant: 'outline' as const,
      icon: <ArrowLeft className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <StandardizedCard size="lg" className="text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-red-900 mb-1">Error Code: 403</h3>
            <p className="text-sm text-red-700">Insufficient permissions</p>
          </div>
          
          <ActionButtonGroup buttons={buttons} orientation="vertical" />
        </StandardizedCard>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
