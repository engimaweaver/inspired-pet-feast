
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AppDock from '@/components/AppDock';
import AppWindow from '@/components/AppWindow';
import iPadHeader from '@/components/iPadHeader';
import Dashboard from '@/components/Dashboard';
import EnhancedBillingScreen from '@/components/EnhancedBillingScreen';
import MenuManagement from '@/components/MenuManagement';
import InventoryManagement from '@/components/InventoryManagement';
import ReservationSystem from '@/components/ReservationSystem';
import OnlineOrderingSystem from '@/components/OnlineOrderingSystem';
import KitchenDisplaySystem from '@/components/KitchenDisplaySystem';
import StaffManagement from '@/components/StaffManagement';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import MultiStoreAnalytics from '@/components/MultiStoreAnalytics';
import CustomerLoyalty from '@/components/CustomerLoyalty';
import AIRecommendationEngine from '@/components/AIRecommendationEngine';
import FloorPlanScreen from '@/components/FloorPlanScreen';
import FinancialAnalytics from '@/components/FinancialAnalytics';
import CostManagement from '@/components/CostManagement';
import CustomerFeedback from '@/components/CustomerFeedback';
import ReviewManagement from '@/components/ReviewManagement';
import EnterpriseAnalyticsDashboard from '@/components/EnterpriseAnalyticsDashboard';
import SystemMonitoringDashboard from '@/components/SystemMonitoringDashboard';
import ComplianceManagement from '@/components/ComplianceManagement';
import RoleBasedDashboard from '@/components/RoleBasedDashboard';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';

const Index = () => {
  const [activeApp, setActiveApp] = useState('dashboard');
  const { toast } = useToast();
  const { isFeatureEnabled } = usePremiumFeatures();

  // Mock user for role-based dashboard
  const currentUser = {
    id: 'user-1',
    name: 'Admin User',
    role: 'admin' as const,
    store: 'all'
  };

  const getAppTitle = (appId: string): string => {
    const titles: Record<string, string> = {
      'dashboard': 'Dashboard',
      'billing': 'Billing & POS',
      'menu': 'Menu Management',
      'inventory': 'Inventory',
      'reservations': 'Reservations',
      'online-orders': 'Online Orders',
      'kitchen': 'Kitchen Display',
      'staff': 'Staff Management',
      'analytics': 'Analytics',
      'multi-store': 'Multi-Store Analytics',
      'loyalty': 'Customer Loyalty',
      'ai-recommendations': 'AI Recommendations',
      'floor-plan': 'Floor Plan',
      'financial-analytics': 'Financial Analytics',
      'cost-management': 'Cost Management',
      'customer-feedback': 'Customer Feedback',
      'review-management': 'Review Management',
      'enterprise-analytics': 'Enterprise Analytics',
      'system-monitoring': 'System Monitoring',
      'compliance': 'Compliance Management'
    };
    return titles[appId] || 'RestaurantOS';
  };

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'dashboard':
        return <RoleBasedDashboard currentUser={currentUser} />;
      case 'billing':
        return <EnhancedBillingScreen />;
      case 'menu':
        return <MenuManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'reservations':
        return <ReservationSystem />;
      case 'online-orders':
        return <OnlineOrderingSystem />;
      case 'kitchen':
        return <KitchenDisplaySystem />;
      case 'staff':
        return <StaffManagement />;
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'multi-store':
        return isFeatureEnabled('multi-store') ? <MultiStoreAnalytics /> : <Dashboard />;
      case 'loyalty':
        return isFeatureEnabled('customer-loyalty') ? <CustomerLoyalty /> : <Dashboard />;
      case 'ai-recommendations':
        return isFeatureEnabled('ai-recommendations') ? <AIRecommendationEngine /> : <Dashboard />;
      case 'floor-plan':
        return <FloorPlanScreen />;
      case 'financial-analytics':
        return isFeatureEnabled('financial-analytics') ? <FinancialAnalytics /> : <Dashboard />;
      case 'cost-management':
        return isFeatureEnabled('cost-management') ? <CostManagement /> : <Dashboard />;
      case 'customer-feedback':
        return isFeatureEnabled('customer-feedback') ? <CustomerFeedback /> : <Dashboard />;
      case 'review-management':
        return isFeatureEnabled('review-management') ? <ReviewManagement /> : <Dashboard />;
      case 'enterprise-analytics':
        return isFeatureEnabled('advanced-reporting') ? <EnterpriseAnalyticsDashboard /> : <Dashboard />;
      case 'system-monitoring':
        return <SystemMonitoringDashboard />;
      case 'compliance':
        return <ComplianceManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <LanguageProvider>
      <div 
        className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 198, 198, 0.2) 0%, transparent 50%)
          `
        }}
      >
        <iPadHeader />
        
        <main className="pt-16 pb-24">
          <AppWindow title={getAppTitle(activeApp)}>
            {renderActiveApp()}
          </AppWindow>
        </main>
        
        <AppDock 
          onAppSelect={setActiveApp}
          activeApp={activeApp}
        />
      </div>
    </LanguageProvider>
  );
};

export default Index;
