
import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import MenuManagement from '../components/MenuManagement';
import StaffManagement from '../components/StaffManagement';
import BillingScreen from '../components/BillingScreen';
import QuickAddButton from '../components/QuickAddButton';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'menu':
        return <MenuManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'billing':
        return <BillingScreen />;
      default:
        return <Dashboard />;
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
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
      
      {/* Quick Add Button - only show when not on billing screen */}
      {activeSection !== 'billing' && (
        <QuickAddButton onClick={handleQuickBill} />
      )}
    </div>
  );
};

export default Index;
