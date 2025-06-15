
import { useCallback } from 'react';
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

export const useBillOperations = (
  bills: Bill[],
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>,
  setActiveBillId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const createBill = useCallback((type: 'dine-in' | 'takeaway' | 'delivery', name?: string): string => {
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
  }, [bills.length, setBills, setActiveBillId]);

  const updateBillItems = useCallback((billId: string, items: OrderItem[]) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, items, updatedAt: new Date() }
        : bill
    ));
  }, [setBills]);

  const updateCustomerInfo = useCallback((billId: string, customerInfo: Bill['customerInfo']) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, customerInfo, updatedAt: new Date() }
        : bill
    ));
  }, [setBills]);

  const deleteBill = useCallback((billId: string) => {
    setBills(prev => {
      const updated = prev.filter(bill => bill.id !== billId);
      return updated;
    });
    setActiveBillId(prev => prev === billId ? (bills.length > 1 ? bills[0].id : null) : prev);
  }, [setBills, setActiveBillId, bills]);

  const setBillStatus = useCallback((billId: string, status: Bill['status']) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, status, updatedAt: new Date() }
        : bill
    ));
  }, [setBills]);

  const duplicateBill = useCallback((billId: string): string => {
    const originalBill = bills.find(bill => bill.id === billId);
    if (!originalBill) return '';

    const newBillId = uuidv4();
    
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
  }, [bills, setBills, setActiveBillId]);

  return {
    createBill,
    updateBillItems,
    updateCustomerInfo,
    deleteBill,
    setBillStatus,
    duplicateBill,
  };
};
