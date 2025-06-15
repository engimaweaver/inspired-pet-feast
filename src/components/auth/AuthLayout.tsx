
import React from 'react';
import { StandardizedCard } from '@/components/ui/standardized-card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">RestaurantOS</h1>
          <p className="text-gray-600">Management Suite</p>
        </div>
        
        <StandardizedCard title={title} subtitle={subtitle} size="lg">
          {children}
        </StandardizedCard>
      </div>
    </div>
  );
};
