
import { 
  LayoutDashboard, 
  Receipt, 
  Menu, 
  Package, 
  Calendar, 
  ShoppingCart, 
  ChefHat, 
  Users, 
  BarChart3, 
  Building2, 
  Heart, 
  Brain, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  MessageSquare, 
  Star, 
  PieChart, 
  Monitor, 
  Shield 
} from 'lucide-react';
import { MenuItem } from '@/types/sidebar';

const baseMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'billing', label: 'Billing', icon: Receipt },
  { id: 'menu', label: 'Menu Management', icon: Menu },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'reservations', label: 'Reservations', icon: Calendar },
  { id: 'online-orders', label: 'Online Orders', icon: ShoppingCart },
  { id: 'kitchen', label: 'Kitchen Display', icon: ChefHat },
  { id: 'staff', label: 'Staff Management', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'floor-plan', label: 'Floor Plan', icon: MapPin },
];

const premiumMenuItems: MenuItem[] = [
  { id: 'multi-store', label: 'Multi-Store Analytics', icon: Building2, premium: 'multi-store' },
  { id: 'loyalty', label: 'Customer Loyalty', icon: Heart, premium: 'customer-loyalty' },
  { id: 'ai-recommendations', label: 'AI Recommendations', icon: Brain, premium: 'ai-recommendations' },
  { id: 'financial-analytics', label: 'Financial Analytics', icon: TrendingUp, premium: 'financial-analytics' },
  { id: 'cost-management', label: 'Cost Management', icon: DollarSign, premium: 'cost-management' },
  { id: 'customer-feedback', label: 'Customer Feedback', icon: MessageSquare, premium: 'customer-feedback' },
  { id: 'review-management', label: 'Review Management', icon: Star, premium: 'review-management' },
  { id: 'enterprise-analytics', label: 'Enterprise Analytics', icon: PieChart, premium: 'advanced-reporting' },
  { id: 'system-monitoring', label: 'System Monitoring', icon: Monitor },
  { id: 'compliance', label: 'Compliance', icon: Shield },
];

export const getMenuItems = (userRole: 'admin' | 'manager' | 'cashier'): MenuItem[] => {
  if (userRole === 'admin') {
    return [...baseMenuItems, ...premiumMenuItems];
  }
  
  if (userRole === 'manager') {
    return [...baseMenuItems, ...premiumMenuItems.filter(item => 
      !['enterprise-analytics', 'system-monitoring', 'compliance'].includes(item.id)
    )];
  }
  
  // Cashier role - limited access
  return baseMenuItems.filter(item => 
    ['dashboard', 'billing', 'menu', 'reservations', 'online-orders', 'kitchen'].includes(item.id)
  );
};
