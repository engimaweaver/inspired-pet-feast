
import React from 'react';
import { Loader2 } from 'lucide-react';

interface GlobalLoadingProps {
  message?: string;
  overlay?: boolean;
}

export const GlobalLoading = ({ message = 'Loading...', overlay = true }: GlobalLoadingProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-gray-600">{message}</p>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      {content}
    </div>
  );
};

export const PageLoading = ({ message = 'Loading page...' }: { message?: string }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-xl">R</span>
        </div>
        <div className="space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

export const ComponentLoading = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
    </div>
  );
};
