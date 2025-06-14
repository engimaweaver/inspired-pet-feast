
import { Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import { getMenuItems } from '@/constants/menuItems';
import { MenuItem } from '@/types/sidebar';

interface SidebarNavigationProps {
  isOpen: boolean;
  activeSection: string;
  userRole: 'admin' | 'manager' | 'cashier';
  onMenuClick: (item: MenuItem) => void;
}

const SidebarNavigation = ({ isOpen, activeSection, userRole, onMenuClick }: SidebarNavigationProps) => {
  const menuItems = getMenuItems(userRole);
  const { isFeatureEnabled } = usePremiumFeatures();

  return (
    <nav className="mt-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isPremium = item.premium && !isFeatureEnabled(item.premium);
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start px-6 py-3 text-left hover:bg-slate-800 transition-colors ${
              activeSection === item.id ? 'bg-slate-800 border-r-2 border-blue-500' : ''
            } ${isPremium ? 'opacity-75' : ''}`}
            onClick={() => onMenuClick(item)}
          >
            <div className="flex items-center w-full">
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && (
                <>
                  <span className="ml-3 flex-1">{item.label}</span>
                  {isPremium && (
                    <Badge variant="secondary" className="ml-2 text-xs bg-yellow-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </>
              )}
            </div>
          </Button>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
