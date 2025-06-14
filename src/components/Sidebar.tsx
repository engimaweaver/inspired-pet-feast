
import { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import SidebarUpgradePrompt from './SidebarUpgradePrompt';
import PremiumUpgradeModal from './PremiumUpgradeModal';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import { SidebarProps, MenuItem } from '@/types/sidebar';

const Sidebar = ({ isOpen, activeSection, setActiveSection, userRole }: SidebarProps) => {
  const { isFeatureEnabled } = usePremiumFeatures();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeatureId, setUpgradeFeatureId] = useState<string | undefined>();

  const handleMenuClick = (item: MenuItem) => {
    if (item.premium && !isFeatureEnabled(item.premium)) {
      setUpgradeFeatureId(item.premium);
      setShowUpgradeModal(true);
    } else {
      setActiveSection(item.id);
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleCloseModal = () => {
    setShowUpgradeModal(false);
    setUpgradeFeatureId(undefined);
  };

  return (
    <>
      <aside className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-30 ${
        isOpen ? 'w-64' : 'w-16'
      }`}>
        <SidebarHeader isOpen={isOpen} userRole={userRole} />
        
        <SidebarNavigation 
          isOpen={isOpen}
          activeSection={activeSection}
          userRole={userRole}
          onMenuClick={handleMenuClick}
        />
        
        <SidebarUpgradePrompt 
          isOpen={isOpen}
          userRole={userRole}
          onUpgradeClick={handleUpgradeClick}
        />
      </aside>

      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleCloseModal}
        featureId={upgradeFeatureId}
      />
    </>
  );
};

export default Sidebar;
