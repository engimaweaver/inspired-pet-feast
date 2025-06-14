
import { useState } from 'react';
import { Crown, Shield, UserCheck } from 'lucide-react';
import Dashboard from './Dashboard';
import MultiStoreAnalytics from './MultiStoreAnalytics';
import StoreSelector from './StoreSelector';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  store?: string;
}

interface Store {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
}

interface RoleBasedDashboardProps {
  currentUser: User;
}

const RoleBasedDashboard = ({ currentUser }: RoleBasedDashboardProps) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Admin sees multi-store analytics by default
  if (currentUser.role === 'admin') {
    return <MultiStoreAnalytics />;
  }

  // Manager sees store selector and can view their assigned store or others (if they have permission)
  if (currentUser.role === 'manager') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600">Store management and analytics</p>
            </div>
          </div>
          <StoreSelector
            selectedStore={selectedStore}
            onStoreSelect={setSelectedStore}
            showAllStores={false}
          />
        </div>
        <Dashboard />
      </div>
    );
  }

  // Cashier sees simplified dashboard focused on POS operations
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <UserCheck className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cashier Dashboard</h1>
          <p className="text-gray-600">Point of sale operations - {currentUser.store}</p>
        </div>
      </div>
      <Dashboard />
    </div>
  );
};

export default RoleBasedDashboard;
