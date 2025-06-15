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
import { MenuItem as MenuItemType } from '@/types/billing';
import { useBillingCalculations } from '@/hooks/useBillingCalculations';
import { SAMPLE_MENU_ITEMS_INR } from '@/constants/indiaData';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDisplayText, getToastText } from '@/utils/languageUtils';

const BillingScreen = () => {
  const [orderItems, setOrderItems] = useState<UnifiedOrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [interfaceMode, setInterfaceMode] = useState<'desktop' | 'touch'>('desktop');
  const { toast } = useToast();
  const { language } = useLanguage();

  // Convert sample menu items to proper format
  const menuItems: MenuItemType[] = SAMPLE_MENU_ITEMS_INR.map(item => ({
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

  const addToOrder = (menuItem: MenuItemType) => {
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
    const toastText = getToastText(
      'Item Added',
      'आइटम जोड़ा गया',
      `${menuItem.name} added to order`,
      `${menuItem.name} ऑर्डर में जोड़ा गया`,
      language
    );
    toast(toastText);
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
    const toastText = getToastText(
      'Order Cleared',
      'ऑर्डर साफ़ किया गया',
      'All items removed from order',
      'ऑर्डर से सभी आइटम हटा दिए गए',
      language
    );
    toast(toastText);
  };

  const printBill = () => {
    if (orderItems.length === 0) {
      const toastText = getToastText(
        'No Items',
        'कोई आइटम नहीं',
        'Please add items to print bill',
        'बिल प्रिंट करने के लिए कृपया आइटम जोड़ें',
        language
      );
      toast({
        ...toastText,
        variant: "destructive",
      });
      return;
    }

    const toastText = getToastText(
      'Printing Bill',
      'बिल प्रिंट हो रहा है',
      'Bill sent to printer',
      'बिल प्रिंटर को भेजा गया',
      language
    );
    toast(toastText);
    
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
          <h1 className="text-xl font-bold">
            {getDisplayText('Touch Billing Interface', 'स्पर्श बिलिंग इंटरफेस', language)}
          </h1>
          <Button
            variant="outline"
            onClick={() => setInterfaceMode('desktop')}
            className="flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            {getDisplayText('Switch to Desktop', 'डेस्कटॉप पर स्विच करें', language)}
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
          <h1 className="text-xl font-bold">
            {getDisplayText('Desktop Billing Interface', 'डेस्कटॉप बिलिंग इंटरफेस', language)}
          </h1>
          <Button
            variant="outline"
            onClick={() => setInterfaceMode('touch')}
            className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <Smartphone className="h-4 w-4" />
            {getDisplayText('Switch to Touch Interface', 'स्पर्श इंटरफेस पर स्विच करें', language)}
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
