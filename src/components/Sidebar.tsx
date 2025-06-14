
import { 
  BarChart3, 
  Users, 
  Menu as MenuIcon, 
  ShoppingCart, 
  Settings,
  Home,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'menu', label: 'Menu Management', icon: MenuIcon },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'bookings', label: 'Reservations', icon: Calendar },
  { id: 'billing', label: 'Billing', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ isOpen, activeSection, setActiveSection }: SidebarProps) => {
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
      
      {isOpen && (
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
