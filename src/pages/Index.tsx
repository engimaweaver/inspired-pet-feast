
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
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
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const { isFeatureEnabled } = usePremiumFeatures();

  // Mock user for role-based dashboard
  const currentUser = {
    id: 'user-1',
    name: 'Admin User',
    role: 'admin' as const,
    store: 'all'
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
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
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar}
          activeComponent={activeComponent}
          onComponentChange={setActiveComponent}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto">
            {renderActiveComponent()}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
