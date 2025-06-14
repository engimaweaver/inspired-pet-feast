
import { useState } from 'react';
import Header from '../components/Header';
import RoleBasedHeader from '../components/RoleBasedHeader';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import RoleBasedDashboard from '../components/RoleBasedDashboard';
import MultiStoreAnalytics from '../components/MultiStoreAnalytics';
import StoreManagement from '../components/StoreManagement';
import MenuManagement from '../components/MenuManagement';
import StaffManagement from '../components/StaffManagement';
import BillingScreen from '../components/BillingScreen';
import FloorPlanScreen from '../components/FloorPlanScreen';
import QuickAddButton from '../components/QuickAddButton';

// Mock user data - will come from authentication later
const mockUser = {
  id: '1',
  name: 'Sarah Chen',
  role: 'admin' as const, // Change this to 'manager' or 'cashier' to test different views
  store: 'Downtown Cafe'
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <RoleBasedDashboard currentUser={mockUser} />;
      case 'analytics':
        return mockUser.role === 'admin' ? <MultiStoreAnalytics /> : <Dashboard />;
      case 'stores':
        return mockUser.role === 'admin' ? <StoreManagement /> : <Dashboard />;
      case 'menu':
        return <MenuManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'billing':
        return <BillingScreen />;
      case 'floorplan':
        return <FloorPlanScreen />;
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
