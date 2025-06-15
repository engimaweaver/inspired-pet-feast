
import { Bell, Search, User, Wifi, Battery, Signal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const iPadHeader = () => {
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gray-900/10 backdrop-blur-xl border-b border-gray-200/20 px-6 flex items-center justify-between z-40">
      {/* Left side - Time and status */}
      <div className="flex items-center space-x-4">
        <div className="text-sm font-medium text-gray-900">
          {currentTime}
        </div>
        <div className="text-sm text-gray-600">
          RestaurantOS
        </div>
      </div>
      
      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search apps, orders, menu items..."
            className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-full"
          />
        </div>
      </div>
      
      {/* Right side - Status icons and user */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" className="relative p-2 rounded-full">
          <Bell className="h-5 w-5 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>
        
        <div className="flex items-center space-x-2 text-gray-700">
          <Signal className="h-4 w-4" />
          <Wifi className="h-4 w-4" />
          <Battery className="h-4 w-4" />
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default iPadHeader;
