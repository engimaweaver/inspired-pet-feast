
import { useState } from 'react';
import { Plus, Minus, Trash2, CreditCard, Printer, Search, ShoppingCart, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import TouchPaymentModal from './TouchPaymentModal';

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

const TouchBillingScreen = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  // Enhanced menu items with color coding
  const menuItems: MenuItem[] = [
    { id: '1', name: 'Butter Chicken', price: 320, category: 'Main Course', available: true },
    { id: '2', name: 'Dal Makhani', price: 180, category: 'Main Course', available: true },
    { id: '3', name: 'Chicken Biryani', price: 380, category: 'Rice', available: true },
    { id: '4', name: 'Paneer Tikka', price: 280, category: 'Starter', available: true },
    { id: '5', name: 'Garlic Naan', price: 80, category: 'Bread', available: true },
    { id: '6', name: 'Masala Chai', price: 40, category: 'Beverages', available: true },
    { id: '7', name: 'Chicken Tikka', price: 300, category: 'Starter', available: true },
    { id: '8', name: 'Mutton Biryani', price: 420, category: 'Rice', available: true },
    { id: '9', name: 'Butter Naan', price: 70, category: 'Bread', available: true },
    { id: '10', name: 'Mango Lassi', price: 60, category: 'Beverages', available: true },
  ];

  const categories = [
    { name: 'All', color: 'bg-gray-500', textColor: 'text-white' },
    { name: 'Starter', color: 'bg-orange-500', textColor: 'text-white' },
    { name: 'Main Course', color: 'bg-red-500', textColor: 'text-white' },
    { name: 'Rice', color: 'bg-yellow-500', textColor: 'text-white' },
    { name: 'Bread', color: 'bg-amber-600', textColor: 'text-white' },
    { name: 'Beverages', color: 'bg-blue-500', textColor: 'text-white' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const getCategoryStyle = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category || { color: 'bg-gray-100', textColor: 'text-gray-800' };
  };

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
      setOrderItems([...orderItems, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        category: menuItem.category
      }]);
    }
    toast({
      title: "Item Added",
      description: `${menuItem.name} added to order`,
      duration: 1000,
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
    }).filter(Boolean) as OrderItem[]);
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return Math.round(calculateTotal() * 0.18);
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const clearOrder = () => {
    setOrderItems([]);
    toast({
      title: "Order Cleared",
      description: "All items removed from order",
      duration: 1000,
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
      duration: 1000,
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header with Search and Controls */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg rounded-xl border-2"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setViewMode('grid')}
              className="h-12 px-6"
            >
              <Grid3X3 className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setViewMode('list')}
              className="h-12 px-6"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Menu Items */}
        <div className="flex-1 flex flex-col p-4 space-y-4">
          {/* Category Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 text-lg font-semibold rounded-xl whitespace-nowrap ${
                  selectedCategory === category.name 
                    ? `${category.color} ${category.textColor} hover:opacity-90` 
                    : 'hover:bg-gray-100'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Menu Items */}
          <div className={`flex-1 overflow-y-auto ${
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
              : 'space-y-3'
          }`}>
            {filteredMenuItems.map(item => {
              const categoryStyle = getCategoryStyle(item.category);
              return (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 ${
                    viewMode === 'list' ? 'flex items-center' : ''
                  }`}
                  onClick={() => addToOrder(item)}
                >
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex items-center justify-between w-full' : ''}`}>
                    <div className={viewMode === 'list' ? 'flex items-center flex-1' : ''}>
                      <div className={viewMode === 'list' ? 'flex-1' : ''}>
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                        <Badge 
                          className={`${categoryStyle.color} ${categoryStyle.textColor} mb-2 text-xs`}
                        >
                          {item.category}
                        </Badge>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
                          {viewMode === 'grid' && (
                            <Button 
                              size="lg"
                              className="ml-2 h-10 w-10 rounded-full p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToOrder(item);
                              }}
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {viewMode === 'list' && (
                        <Button 
                          size="lg"
                          className="ml-4 h-12 w-12 rounded-full p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToOrder(item);
                          }}
                        >
                          <Plus className="h-6 w-6" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Order Summary */}
        <div className="w-96 bg-white shadow-lg border-l flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Current Order
              </h2>
              {orderItems.length > 0 && (
                <Button variant="outline" size="lg" onClick={clearOrder} className="h-10">
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
            {orderItems.length > 0 && (
              <Badge variant="secondary" className="mt-2 text-sm">
                {orderItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </Badge>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {orderItems.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No items in order</p>
                <p className="text-sm">Tap items to add them</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map(item => (
                  <Card key={item.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.price} each</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button 
                            size="lg"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-10 w-10 p-0 rounded-full"
                          >
                            <Minus className="h-5 w-5" />
                          </Button>
                          <span className="text-xl font-bold w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="lg"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-10 w-10 p-0 rounded-full"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                        <span className="text-xl font-bold text-green-600">₹{item.price * item.quantity}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary and Actions */}
          {orderItems.length > 0 && (
            <div className="border-t bg-gray-50 p-4 space-y-4">
              <div className="space-y-3 text-lg">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%):</span>
                  <span className="font-semibold">₹{calculateTax()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3">
                  <span>Total:</span>
                  <span className="text-green-600">₹{calculateGrandTotal()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full h-14 text-lg font-semibold rounded-xl"
                  size="lg"
                  onClick={() => setPaymentModalOpen(true)}
                >
                  <CreditCard className="h-6 w-6 mr-3" />
                  Process Payment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-lg rounded-xl" 
                  onClick={printBill}
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Print Bill
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <TouchPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        total={calculateGrandTotal()}
        onPaymentComplete={() => {
          setOrderItems([]);
          setPaymentModalOpen(false);
        }}
      />
    </div>
  );
};

export default TouchBillingScreen;
