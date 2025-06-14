
import { Button } from '@/components/ui/button';

interface SidebarUpgradePromptProps {
  isOpen: boolean;
  userRole: 'admin' | 'manager' | 'cashier';
  onUpgradeClick: () => void;
}

const SidebarUpgradePrompt = ({ isOpen, userRole, onUpgradeClick }: SidebarUpgradePromptProps) => {
  if (!isOpen || userRole === 'cashier') {
    return null;
  }

  return (
    <div className="absolute bottom-6 left-6 right-6">
      <div className="bg-blue-600 rounded-lg p-4 text-center">
        <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
        <p className="text-xs text-blue-100 mb-3">Get advanced analytics and more features</p>
        <Button 
          size="sm" 
          className="bg-white text-blue-600 hover:bg-blue-50 w-full"
          onClick={onUpgradeClick}
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  );
};

export default SidebarUpgradePrompt;
