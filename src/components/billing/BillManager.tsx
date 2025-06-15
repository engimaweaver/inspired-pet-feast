
import { useState, createContext, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { OrderItem } from '@/types/billing';

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

interface BillManagerContextType {
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

const BillManagerContext = createContext<BillManagerContextType | null>(null);

export const useBillManager = () => {
  const context = useContext(BillManagerContext);
  if (!context) {
    throw new Error('useBillManager must be used within BillManagerProvider');
  }
  return context;
};

interface BillManagerProviderProps {
  children: ReactNode;
}

export const BillManagerProvider = ({ children }: BillManagerProviderProps) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeBillId, setActiveBillId] = useState<string | null>(null);

  const activeBill = bills.find(bill => bill.id === activeBillId) || null;

  const createNewBill = (type: 'dine-in' | 'takeaway' | 'delivery', name?: string): string => {
    const billId = uuidv4();
    const billNumber = bills.length + 1;
    const billName = name || `Bill #${billNumber}`;
    
    const newBill: Bill = {
      id: billId,
      name: billName,
      items: [],
      customerInfo: { type },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBills(prev => [...prev, newBill]);
    setActiveBillId(billId);
    return billId;
  };

  const switchToBill = (billId: string) => {
    setActiveBillId(billId);
  };

  const updateBillItems = (billId: string, items: OrderItem[]) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, items, updatedAt: new Date() }
        : bill
    ));
  };

  const updateCustomerInfo = (billId: string, customerInfo: Bill['customerInfo']) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, customerInfo, updatedAt: new Date() }
        : bill
    ));
  };

  const deleteBill = (billId: string) => {
    setBills(prev => prev.filter(bill => bill.id !== billId));
    if (activeBillId === billId) {
      const remainingBills = bills.filter(bill => bill.id !== billId);
      setActiveBillId(remainingBills.length > 0 ? remainingBills[0].id : null);
    }
  };

  const setBillStatus = (billId: string, status: Bill['status']) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, status, updatedAt: new Date() }
        : bill
    ));
  };

  const duplicateBill = (billId: string): string => {
    const originalBill = bills.find(bill => bill.id === billId);
    if (!originalBill) return '';

    const newBillId = uuidv4();
    const billNumber = bills.length + 1;
    
    const duplicatedBill: Bill = {
      ...originalBill,
      id: newBillId,
      name: `${originalBill.name} (Copy)`,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBills(prev => [...prev, duplicatedBill]);
    setActiveBillId(newBillId);
    return newBillId;
  };

  const value: BillManagerContextType = {
    bills,
    activeBillId,
    activeBill,
    createNewBill,
    switchToBill,
    updateBillItems,
    updateCustomerInfo,
    deleteBill,
    setBillStatus,
    duplicateBill,
  };

  return (
    <BillManagerContext.Provider value={value}>
      {children}
    </BillManagerContext.Provider>
  );
};
