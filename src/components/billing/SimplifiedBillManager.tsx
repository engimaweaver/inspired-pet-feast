
import { useState, createContext, useContext, ReactNode } from 'react';
import { OrderItem } from '@/types/billing';
import { useBillOperations } from '@/hooks/useBillOperations';

interface Bill {
  id: string;
  name: string;
  items: OrderItem[];
  customerInfo?: {
    name?: string;
    phone?: string;
    type: 'dine-in' | 'takeaway' | 'delivery';
    tableNumber?: string;
  };
  status: 'draft' | 'active' | 'completed' | 'on-hold';
  createdAt: Date;
  updatedAt: Date;
}

interface SimplifiedBillManagerContextType {
  bills: Bill[];
  activeBillId: string | null;
  activeBill: Bill | null;
  createNewBill: (type: 'dine-in' | 'takeaway' | 'delivery', name?: string) => string;
  switchToBill: (billId: string) => void;
  updateBillItems: (billId: string, items: OrderItem[]) => void;
  updateCustomerInfo: (billId: string, customerInfo: Bill['customerInfo']) => void;
  deleteBill: (billId: string) => void;
  setBillStatus: (billId: string, status: Bill['status']) => void;
  duplicateBill: (billId: string) => string;
}

const SimplifiedBillManagerContext = createContext<SimplifiedBillManagerContextType | null>(null);

export const useSimplifiedBillManager = () => {
  const context = useContext(SimplifiedBillManagerContext);
  if (!context) {
    throw new Error('useSimplifiedBillManager must be used within SimplifiedBillManagerProvider');
  }
  return context;
};

interface SimplifiedBillManagerProviderProps {
  children: ReactNode;
}

export const SimplifiedBillManagerProvider = ({ children }: SimplifiedBillManagerProviderProps) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeBillId, setActiveBillId] = useState<string | null>(null);

  const activeBill = bills.find(bill => bill.id === activeBillId) || null;

  const {
    createBill,
    updateBillItems,
    updateCustomerInfo,
    deleteBill,
    setBillStatus,
    duplicateBill,
  } = useBillOperations(bills, setBills, setActiveBillId);

  const switchToBill = (billId: string) => {
    setActiveBillId(billId);
  };

  const value: SimplifiedBillManagerContextType = {
    bills,
    activeBillId,
    activeBill,
    createNewBill: createBill,
    switchToBill,
    updateBillItems,
    updateCustomerInfo,
    deleteBill,
    setBillStatus,
    duplicateBill,
  };

  return (
    <SimplifiedBillManagerContext.Provider value={value}>
      {children}
    </SimplifiedBillManagerContext.Provider>
  );
};
