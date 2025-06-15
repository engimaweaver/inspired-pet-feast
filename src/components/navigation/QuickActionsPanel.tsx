
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Receipt, Users, Package, Settings, HelpCircle } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
}

export const QuickActionsPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'new-order',
      label: 'New Order',
      icon: <Receipt className="h-4 w-4" />,
      onClick: () => console.log('New Order'),
      tooltip: 'Create a new order'
    },
    {
      id: 'add-customer',
      label: 'Add Customer',
      icon: <Users className="h-4 w-4" />,
      onClick: () => console.log('Add Customer'),
      tooltip: 'Add new customer'
    },
    {
      id: 'inventory',
      label: 'Quick Stock',
      icon: <Package className="h-4 w-4" />,
      onClick: () => console.log('Quick Stock'),
      tooltip: 'Quick inventory update'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => console.log('Settings'),
      tooltip: 'System settings'
    },
    {
      id: 'help',
      label: 'Help',
      icon: <HelpCircle className="h-4 w-4" />,
      onClick: () => console.log('Help'),
      tooltip: 'Get help'
    }
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-40">
        <div className={`flex flex-col-reverse items-end space-y-reverse space-y-2 transition-all duration-300 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {quickActions.map((action) => (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg bg-white hover:bg-gray-50 border-gray-200"
                  onClick={action.onClick}
                >
                  {action.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{action.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 mt-2 ${
                isExpanded ? 'rotate-45' : 'rotate-0'
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Quick Actions</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
