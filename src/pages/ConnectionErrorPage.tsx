
import React, { useState } from 'react';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

const ConnectionErrorPage = () => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.reload();
    } catch (error) {
      setRetrying(false);
    }
  };

  const buttons = [
    {
      label: retrying ? 'Retrying...' : 'Try Again',
      onClick: handleRetry,
      icon: <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />,
      loading: retrying
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <StandardizedCard size="lg" className="text-center">
          <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-8 w-8 text-orange-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
          <p className="text-gray-600 mb-6">
            Unable to connect to the server. Please check your internet connection and try again.
          </p>
          
          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <h3 className="font-medium text-orange-900">Troubleshooting Tips</h3>
            </div>
            <ul className="text-sm text-orange-700 space-y-1 text-left">
              <li>• Check your internet connection</li>
              <li>• Refresh the page</li>
              <li>• Clear your browser cache</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </div>
          
          <ActionButtonGroup buttons={buttons} orientation="vertical" />
        </StandardizedCard>
      </div>
    </div>
  );
};

export default ConnectionErrorPage;
