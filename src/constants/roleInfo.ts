
import { Crown, Shield, UserCheck } from 'lucide-react';
import { RoleInfo } from '@/types/sidebar';

export const getRoleInfo = (role: 'admin' | 'manager' | 'cashier'): RoleInfo => {
  switch (role) {
    case 'admin':
      return { icon: Crown, color: 'bg-purple-600', label: 'Chain Admin' };
    case 'manager':
      return { icon: Shield, color: 'bg-blue-600', label: 'Store Manager' };
    case 'cashier':
      return { icon: UserCheck, color: 'bg-green-600', label: 'Cashier' };
  }
};
