
import { 
  BarChart3, 
  Users, 
  Menu as MenuIcon, 
  ShoppingCart, 
  Settings,
  Home,
  Calendar,
  DollarSign,
  Calculator,
  Grid3X3,
  Store,
  Crown,
  Shield,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  userRole: 'admin' | 'manager' | 'cashier';
}

const getMenuItems = (role: 'admin' | 'manager' | 'cashier') => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  if (role === 'admin') {
    return [
      ...baseItems,
      { id: 'analytics', label: 'Multi-Store Analytics', icon: BarChart3 },
      { id: 'stores', label: 'Store Management', icon: Store },
      { id: 'floorplan', label: 'Floor Plan Management', icon: Grid3X3 },
      { id: 'menu', label: 'Menu Management', icon: MenuIcon },
      { id: 'staff', label: 'Staff Management', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  }

  if (role === 'manager') {
    return [
      ...baseItems,
      { id: 'floorplan', label: 'Floor Plan', icon: Grid3X3 },
      { id: 'billing', label: 'Billing (POS)', icon: Calculator },
      { id: 'menu', label: 'Menu Management', icon: MenuIcon },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'staff', label: 'Staff', icon: Users },
      { id: 'bookings', label: 'Reservations', icon: Calendar },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  }

  // Cashier role
  return [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'billing', label: 'POS System', icon: Calculator },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'floorplan', label: 'Floor Plan', icon: Grid3X3 },
  ];
};

const getRoleInfo = (role: 'admin' | 'manager' | 'cashier') => {
  switch (role) {
    case 'admin':
      return { icon: Crown, color: 'bg-purple-600', label: 'Chain Admin' };
    case 'manager':
      return { icon: Shield, color: 'bg-blue-600', label: 'Store Manager' };
    case 'cashier':
      return { icon: UserCheck, color: 'bg-green-600', label: 'Cashier' };
  }
};

const Sidebar = ({ isOpen, activeSection, setActiveSection, userRole }: SidebarProps) => {
  const menuItems = getMenuItems(userRole);
  const roleInfo = getRoleInfo(userRole);
  const RoleIcon = roleInfo.icon;

  return (
    <aside className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-30 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
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
      
      {/* Role indicator */}
      {isOpen && (
        <div className="px-6 py-3 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <RoleIcon className="h-4 w-4" />
            <span className="text-sm text-slate-300">{roleInfo.label}</span>
          </div>
        </div>
      )}
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start px-6 py-3 text-left hover:bg-slate-800 transition-colors ${
                activeSection === item.id ? 'bg-slate-800 border-r-2 border-blue-500' : ''
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          );
        })}
      </nav>
      
      {isOpen && userRole !== 'cashier' && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-blue-600 rounded-lg p-4 text-center">
            <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
            <p className="text-xs text-blue-100 mb-3">Get advanced analytics and more features</p>
            <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 w-full">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
