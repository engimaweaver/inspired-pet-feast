
export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  premium?: string;
}

export interface RoleInfo {
  icon: React.ComponentType<any>;
  color: string;
  label: string;
}

export interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  userRole: 'admin' | 'manager' | 'cashier';
}
