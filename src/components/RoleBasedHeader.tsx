
import { Bell, Search, User, Menu, Shield, UserCheck, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import LanguageSettingsDialog from './LanguageSettingsDialog';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  store?: string;
}

interface RoleBasedHeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  currentUser: User;
}

const roleConfig = {
  admin: {
    icon: Crown,
    color: 'bg-purple-600',
    label: 'Chain Admin',
    description: 'Full Access'
  },
  manager: {
    icon: Shield,
    color: 'bg-blue-600',
    label: 'Store Manager',
    description: 'Store Management'
  },
  cashier: {
    icon: UserCheck,
    color: 'bg-green-600',
    label: 'Cashier',
    description: 'POS Access'
  }
};

const RoleBasedHeader = ({ toggleSidebar, sidebarOpen, currentUser }: RoleBasedHeaderProps) => {
  const config = roleConfig[currentUser.role];
  const RoleIcon = config.icon;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders, menu items..."
            className="pl-10 w-80 bg-gray-50 border-gray-200"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <LanguageSettingsDialog />
        
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>
        
        <div className="flex items-center space-x-3 border-l pl-4">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <Badge variant="secondary" className="text-xs">
                <RoleIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              {currentUser.role === 'admin' ? 'Chain-wide Access' : currentUser.store}
            </p>
          </div>
          <div className={`h-8 w-8 ${config.color} rounded-full flex items-center justify-center`}>
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default RoleBasedHeader;
