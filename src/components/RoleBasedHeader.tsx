
import { Bell, Search, User, Menu, Shield, UserCheck, Crown, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSettingsDialog from './LanguageSettingsDialog';
import { SettingsPanel } from './settings/SettingsPanel';
import { useSearch } from '@/contexts/SearchContext';
import { BreadcrumbNavigation } from './navigation/BreadcrumbNavigation';
import { QuickActionsPanel } from './navigation/QuickActionsPanel';

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
  const [showSettings, setShowSettings] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders, menu items..."
                className="pl-10 w-80 bg-gray-50 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSettingsDialog />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/help')}
              className="p-2"
            >
              <HelpCircle className="h-4 w-4 text-gray-600" />
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <div className={`h-8 w-8 ${config.color} rounded-full flex items-center justify-center`}>
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/reports')}>
                    Reports Overview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/help')}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & Support
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        <BreadcrumbNavigation />
      </header>

      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <QuickActionsPanel />
    </>
  );
};

export default RoleBasedHeader;
