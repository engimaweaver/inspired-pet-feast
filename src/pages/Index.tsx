import { useState } from 'react';
import Header from '../components/Header';
import RoleBasedHeader from '../components/RoleBasedHeader';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import RoleBasedDashboard from '../components/RoleBasedDashboard';
import MultiStoreAnalytics from '../components/MultiStoreAnalytics';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import StoreManagement from '../components/StoreManagement';
import MenuManagement from '../components/MenuManagement';
import StaffManagement from '../components/StaffManagement';
import BillingScreen from '../components/BillingScreen';
import FloorPlanScreen from '../components/FloorPlanScreen';
import AdminFloorPlanScreen from '../components/AdminFloorPlanScreen';
import InventoryManagement from '../components/InventoryManagement';
import KitchenDisplaySystem from '../components/KitchenDisplaySystem';
import CustomerLoyalty from '../components/CustomerLoyalty';
import QuickAddButton from '../components/QuickAddButton';
import AIRecommendationEngine from '../components/AIRecommendationEngine';
import ReservationSystem from '../components/ReservationSystem';
import OnlineOrderingSystem from '../components/OnlineOrderingSystem';
import AdvancedReservationSystem from '../components/AdvancedReservationSystem';
import EnhancedOnlineOrdering from '../components/EnhancedOnlineOrdering';
import FinancialAnalytics from '../components/FinancialAnalytics';
import CostManagement from '../components/CostManagement';
import CustomerFeedback from '../components/CustomerFeedback';
import ReviewManagement from '../components/ReviewManagement';
import HardwareIntegrationPanel from '../components/HardwareIntegrationPanel';
import EnhancedBillingScreen from '../components/EnhancedBillingScreen';

// Mock user data - changed to cashier role
const mockUser = {
  id: '1',
  name: 'Sarah Chen',
  role: 'cashier' as const, // Changed from 'admin' to 'cashier'
  store: 'Downtown Cafe'
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <RoleBasedDashboard currentUser={mockUser} />;
      case 'ai-recommendations':
        return <AIRecommendationEngine />;
      case 'reservations':
        return <AdvancedReservationSystem />;
      case 'online-ordering':
        return <EnhancedOnlineOrdering />;
      case 'analytics':
        return mockUser.role === 'admin' || mockUser.role === 'manager' ? <MultiStoreAnalytics /> : <Dashboard />;
      case 'advanced-analytics':
        return <AdvancedAnalytics />;
      case 'financial-analytics':
        return <FinancialAnalytics />;
      case 'cost-management':
        return <CostManagement />;
      case 'customer-feedback':
        return <CustomerFeedback />;
      case 'review-management':
        return <ReviewManagement />;
      case 'stores':
        return mockUser.role === 'admin' || mockUser.role === 'manager' ? <StoreManagement /> : <Dashboard />;
      case 'menu':
        return <MenuManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'kitchen':
        return <KitchenDisplaySystem />;
      case 'loyalty':
        return <CustomerLoyalty />;
      case 'staff':
        return <StaffManagement />;
      case 'billing':
        return <EnhancedBillingScreen />;
      case 'floorplan':
        return mockUser.role === 'admin' || mockUser.role === 'manager' ? <AdminFloorPlanScreen /> : <FloorPlanScreen />;
      case 'hardware':
        return <HardwareIntegrationPanel />;
      default:
        return <RoleBasedDashboard currentUser={mockUser} />;
    }
  };

  const handleQuickBill = () => {
    setActiveSection('billing');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar 
        isOpen={sidebarOpen} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        userRole={mockUser.role}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <RoleBasedHeader 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen}
          currentUser={mockUser}
        />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      {/* Quick Add Button - only show when not on billing or floorplan screen */}
      {activeSection !== 'billing' && activeSection !== 'floorplan' && (
        <QuickAddButton onClick={handleQuickBill} />
      )}
    </div>
  );
};

export default Index;
