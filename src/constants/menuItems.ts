
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
  UserCheck,
  Package,
  Monitor,
  Gift,
  TrendingUp,
  Brain,
  Clock,
  Truck,
  Lock,
  PieChart,
  CreditCard,
  MessageCircle,
  Star,
  Mail,
  Share2,
  FileText
} from 'lucide-react';
import { MenuItem } from '@/types/sidebar';

export const getMenuItems = (role: 'admin' | 'manager' | 'cashier'): MenuItem[] => {
  const baseItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  if (role === 'admin') {
    return [
      ...baseItems,
      { id: 'ai-recommendations', label: 'AI Recommendations', icon: Brain, premium: 'ai-recommendations' },
      { id: 'analytics', label: 'Multi-Store Analytics', icon: BarChart3, premium: 'multi-store' },
      { id: 'advanced-analytics', label: 'Advanced Analytics', icon: TrendingUp, premium: 'advanced-analytics' },
      { id: 'financial-analytics', label: 'Financial Analytics', icon: PieChart, premium: 'financial-analytics' },
      { id: 'advanced-reporting', label: 'Executive Reports', icon: FileText, premium: 'advanced-reporting' },
      { id: 'stores', label: 'Store Management', icon: Store, premium: 'multi-store' },
      { id: 'floorplan', label: 'Floor Plan Management', icon: Grid3X3 },
      { id: 'reservations', label: 'Reservations', icon: Calendar },
      { id: 'online-ordering', label: 'Online Orders', icon: Truck },
      { id: 'menu', label: 'Menu Management', icon: MenuIcon },
      { id: 'inventory', label: 'Inventory Management', icon: Package },
      { id: 'cost-management', label: 'Cost Management', icon: CreditCard, premium: 'cost-management' },
      { id: 'staff', label: 'Staff Management', icon: Users },
      { id: 'loyalty', label: 'Customer Loyalty', icon: Gift, premium: 'customer-loyalty' },
      { id: 'customer-feedback', label: 'Customer Feedback', icon: MessageCircle, premium: 'customer-feedback' },
      { id: 'review-management', label: 'Review Management', icon: Star, premium: 'review-management' },
      { id: 'marketing-campaigns', label: 'Marketing Campaigns', icon: Mail, premium: 'marketing-campaigns' },
      { id: 'social-media', label: 'Social Media', icon: Share2, premium: 'social-media' },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  }

  if (role === 'manager') {
    return [
      ...baseItems,
      { id: 'ai-recommendations', label: 'AI Recommendations', icon: Brain, premium: 'ai-recommendations' },
      { id: 'floorplan', label: 'Floor Plan', icon: Grid3X3 },
      { id: 'billing', label: 'Billing (POS)', icon: Calculator },
      { id: 'kitchen', label: 'Kitchen Display', icon: Monitor },
      { id: 'reservations', label: 'Reservations', icon: Calendar },
      { id: 'online-ordering', label: 'Online Orders', icon: Truck },
      { id: 'menu', label: 'Menu Management', icon: MenuIcon },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'cost-management', label: 'Cost Management', icon: CreditCard, premium: 'cost-management' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'advanced-analytics', label: 'Advanced Analytics', icon: TrendingUp, premium: 'advanced-analytics' },
      { id: 'financial-analytics', label: 'Financial Reports', icon: PieChart, premium: 'financial-analytics' },
      { id: 'staff', label: 'Staff', icon: Users },
      { id: 'loyalty', label: 'Customer Loyalty', icon: Gift, premium: 'customer-loyalty' },
      { id: 'customer-feedback', label: 'Customer Feedback', icon: MessageCircle, premium: 'customer-feedback' },
      { id: 'marketing-campaigns', label: 'Marketing', icon: Mail, premium: 'marketing-campaigns' },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  }

  // Cashier role
  return [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'billing', label: 'POS System', icon: Calculator },
    { id: 'kitchen', label: 'Kitchen Display', icon: Monitor },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'floorplan', label: 'Floor Plan', icon: Grid3X3 },
    { id: 'reservations', label: 'Reservations', icon: Clock },
    { id: 'online-ordering', label: 'Online Orders', icon: Truck },
    { id: 'loyalty', label: 'Customer Loyalty', icon: Gift, premium: 'customer-loyalty' },
    { id: 'customer-feedback', label: 'Customer Feedback', icon: MessageCircle, premium: 'customer-feedback' },
  ];
};
