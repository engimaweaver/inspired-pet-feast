
import { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QuickAddModal from './QuickAddModal';
import TouchBillingScreen from './TouchBillingScreen';
import MenuItemCard from './billing/MenuItemCard';
import CategoryFilter from './billing/CategoryFilter';
import SearchAndControls from './billing/SearchAndControls';
import EnhancedOrderSummary from './billing/EnhancedOrderSummary';
import PaymentDialog from './billing/PaymentDialog';
import BillTabs from './billing/BillTabs';
import { BillManagerProvider, useBillManager } from './billing/BillManager';
import { OrderItem, MenuItem } from '@/types/billing';

const BillingContent = () => {
  const { activeBill, updateBillItems } = useBillManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [interfaceMode, setInterfaceMode] = useState<'desktop' | 'touch'>('desktop');
  const { toast } = useToast();

  // Sample menu items
  const menuItems: MenuItem[] = [
    { id: '1', name: 'Butter Chicken', price: 320, category: 'Main Course', available: true },
    { id: '2', name: 'Dal Makhani', price: 180, category: 'Main Course', available: true },
    { id: '3', name: 'Chicken Biryani', price: 380, category: 'Rice', available: true },
    { id: '4', name: 'Paneer Tikka', price: 280, category: 'Starter', available: true },
    { id: '5', name: 'Garlic Naan', price: 80, category: 'Bread', available: true },
    { id: '6', name: 'Masala Chai', price: 40, category: 'Beverages', available: true },
  ];

  const categories = ['All', 'Starter', 'Main Course', 'Rice', 'Bread', 'Beverages'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const orderItems = activeBill?.items || [];

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  const addToOrder = (menuItem: MenuItem) => {
    if (!activeBill) {
      toast({
        title: "No Active Bill",
        description: "Please create a bill first",
        variant: "destructive",
      });
      return;
    }

    const existingItem = orderItems.find(item => item.id === menuItem.id);
    let updatedItems: OrderItem[];

    if (existingItem) {
      updatedItems = orderItems.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedItems = [...orderItems, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        category: menuItem.category
      }];
    }

    updateBillItems(activeBill.id, updatedItems);
    toast({
      title: "Item Added",
      description: `${menuItem.name} added to ${activeBill.name}`,
    });
  };

  const updateQuantity = (id: string, change: number) => {
    if (!activeBill) return;

    const updatedItems = orderItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as OrderItem[];

    updateBillItems(activeBill.id, updatedItems);
  };

  const removeItem = (id: string) => {
    if (!activeBill) return;
    const updatedItems = orderItems.filter(item => item.id !== id);
    updateBillItems(activeBill.id, updatedItems);
  };

  const clearOrder = () => {
    if (!activeBill) return;
    updateBillItems(activeBill.id, []);
    toast({
      title: "Order Cleared",
      description: "All items removed from order",
    });
  };

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateGSTAmount = () => {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.18);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const gst = calculateGSTAmount();
    return subtotal + gst;
  };

  const handlePaymentComplete = () => {
    setPaymentDialogOpen(false);
    if (activeBill) {
      updateBillItems(activeBill.id, []);
    }
  };

  const printBill = () => {
    if (orderItems.length === 0) {
      toast({
        title: "No Items",
        description: "Please add items to print bill",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Printing Bill",
      description: "Bill sent to printer",
    });
    
    window.print();
  };

  const updateItems = (items: OrderItem[]) => {
    if (!activeBill) return;
    updateBillItems(activeBill.id, items);
  };

  if (interfaceMode === 'touch') {
    return (
      <div className="h-full">
        <div className="flex justify-between items-center p-4 bg-white border-b">
          <h1 className="text-xl font-bold">स्पर्श बिलिंग इंटरफेस / Touch Billing Interface</h1>
          <Button
            variant="outline"
            onClick={() => setInterfaceMode('desktop')}
            className="flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            डेस्कटॉप पर स्विच करें / Switch to Desktop
          </Button>
        </div>
        <TouchBillingScreen />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <BillTabs />
      
      <div className="flex-1 flex">
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              उन्नत बिलिंग / Enhanced Billing - {activeBill?.name || 'कोई सक्रिय बिल नहीं / No Active Bill'}
            </h1>
            <Button
              variant="outline"
              onClick={() => setInterfaceMode('touch')}
              className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Smartphone className="h-4 w-4" />
              स्पर्श इंटरफेस पर स्विच करें / Switch to Touch Interface
            </Button>
          </div>

          <SearchAndControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            menuItems={menuItems}
            onAddToOrder={addToOrder}
            onQuickAddClick={() => setQuickAddModalOpen(true)}
          />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
            {filteredMenuItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToOrder={addToOrder}
              />
            ))}
          </div>
        </div>

        <div className="w-96 p-4">
          <EnhancedOrderSummary
            orderItems={orderItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearOrder={clearOrder}
            onProcessPayment={() => setPaymentDialogOpen(true)}
            onPrintBill={printBill}
            onUpdateItems={updateItems}
          />
        </div>
      </div>

      <PaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        grandTotal={calculateGrandTotal()}
        gstAmount={calculateGSTAmount()}
        onPaymentComplete={handlePaymentComplete}
      />

      <QuickAddModal
        isOpen={quickAddModalOpen}
        onClose={() => setQuickAddModalOpen(false)}
        menuItems={menuItems}
        onAddItem={addToOrder}
      />
    </div>
  );
};

const EnhancedBillingScreen = () => {
  return (
    <BillManagerProvider>
      <BillingContent />
    </BillManagerProvider>
  );
};

export default EnhancedBillingScreen;
