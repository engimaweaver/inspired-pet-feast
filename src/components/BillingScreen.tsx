import { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QuickAddModal from './QuickAddModal';
import TouchBillingScreen from './TouchBillingScreen';
import MenuItemCard from './billing/MenuItemCard';
import CategoryFilter from './billing/CategoryFilter';
import SearchAndControls from './billing/SearchAndControls';
import OrderSummary from './billing/OrderSummary';
import PaymentDialog from './billing/PaymentDialog';
import { UnifiedOrderItem } from '@/types/unified-billing';
import { MenuItem } from '@/types/billing';
import { useBillingCalculations } from '@/hooks/useBillingCalculations';
import { SAMPLE_MENU_ITEMS_INR } from '@/constants/indiaData';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

const BillingScreen = () => {
  const [orderItems, setOrderItems] = useState<UnifiedOrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [interfaceMode, setInterfaceMode] = useState<'desktop' | 'touch'>('desktop');
  const { toast } = useToast();

  // Convert sample menu items to proper format
  const menuItems: MenuItem[] = SAMPLE_MENU_ITEMS_INR.map(item => ({
    ...item,
    available: true
  }));

  const categories = ['All', 'Starter', 'Main Course', 'Rice', 'Bread', 'Beverages'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const billSummary = useBillingCalculations(orderItems);

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  const addToOrder = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.id === menuItem.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const menuItemWithHSN = SAMPLE_MENU_ITEMS_INR.find(sample => sample.id === menuItem.id);
      setOrderItems([...orderItems, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        category: menuItem.category,
        hsnCode: menuItemWithHSN?.hsnCode
      }]);
    }
    toast({
      title: "Item Added",
      description: `${menuItem.name} added to order`,
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as UnifiedOrderItem[]);
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const clearOrder = () => {
    setOrderItems([]);
    toast({
      title: "Order Cleared",
      description: "All items removed from order",
    });
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

  const handlePaymentComplete = () => {
    setPaymentDialogOpen(false);
    setOrderItems([]);
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
    <div className="h-full flex">
      <div className="flex-1 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">डेस्कटॉप बिलिंग इंटरफेस / Desktop Billing Interface</h1>
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
        <OrderSummary
          orderItems={orderItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearOrder={clearOrder}
          onProcessPayment={() => setPaymentDialogOpen(true)}
          onPrintBill={printBill}
        />
      </div>

      <PaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        grandTotal={billSummary.grandTotal}
        gstAmount={billSummary.gstBreakdown.total}
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

export default BillingScreen;
