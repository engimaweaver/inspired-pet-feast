
import { getRoleInfo } from '@/constants/roleInfo';

interface SidebarHeaderProps {
  isOpen: boolean;
  userRole: 'admin' | 'manager' | 'cashier';
}

const SidebarHeader = ({ isOpen, userRole }: SidebarHeaderProps) => {
  const roleInfo = getRoleInfo(userRole);
  const RoleIcon = roleInfo.icon;

  return (
    <>
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold">RestaurantOS</h1>
              <p className="text-xs text-slate-400">Management Suite</p>
            </div>
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="px-6 py-3 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <RoleIcon className="h-4 w-4" />
            <span className="text-sm text-slate-300">{roleInfo.label}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarHeader;
