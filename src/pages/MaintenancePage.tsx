
import React from 'react';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { Progress } from '@/components/ui/progress';
import { Settings, Clock, AlertTriangle } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <StandardizedCard size="lg" className="text-center">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">System Maintenance</h1>
          <p className="text-gray-600 mb-6">
            We're currently performing scheduled maintenance to improve your experience. 
            The system will be back online shortly.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Maintenance Progress</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-blue-900">Estimated Time</h3>
            </div>
            <p className="text-sm text-blue-700">Approximately 15 minutes remaining</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="font-medium text-amber-900">What's Being Updated</h3>
            </div>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Performance improvements</li>
              <li>• Security updates</li>
              <li>• New feature deployment</li>
            </ul>
          </div>
        </StandardizedCard>
      </div>
    </div>
  );
};

export default MaintenancePage;
