
import { useState } from 'react';
import { Plus, Minus, Trash2, CreditCard, Printer, Barcode, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
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

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    
    // Simulate barcode lookup
    const foundItem = menuItems.find(item => item.id === barcodeInput);
    if (foundItem) {
      addToOrder(foundItem);
      setBarcodeInput('');
      toast({
        title: "Item Found",
        description: `${foundItem.name} added via barcode scan`,
      });
    } else {
      toast({
        title: "Item Not Found",
        description: "Barcode not recognized",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return Math.round(calculateTotal() * 0.18); // 18% GST
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const handlePayment = () => {
    if (orderItems.length === 0) {
      toast({
        title: "No Items",
        description: "Please add items to the order first",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'cash' && !amountReceived) {
      toast({
        title: "Amount Required",
        description: "Please enter the amount received",
        variant: "destructive",
      });
      return;
    }

    // Process payment logic here
    toast({
      title: "Payment Successful",
      description: `Order processed via ${paymentMethod}`,
    });
    
    setPaymentDialogOpen(false);
    setOrderItems([]);
    setAmountReceived('');
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

    // Simulate bill printing
    toast({
      title: "Printing Bill",
      description: "Bill sent to printer",
    });
    
    // In a real application, this would integrate with a thermal printer
    window.print();
  };

  const clearOrder = () => {
    setOrderItems([]);
    toast({
      title: "Order Cleared",
      description: "All items removed from order",
    });
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel - Menu Items */}
      <div className="flex-1 space-y-4">
        {/* Search and Barcode */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
            <Input
              placeholder="Scan barcode..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-40"
            />
            <Button type="submit" variant="outline">
              <Barcode className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
          {filteredMenuItems.map(item => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <span className="font-bold text-green-600">₹{item.price}</span>
                </div>
                <Button 
                  onClick={() => addToOrder(item)}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Panel - Order Summary */}
      <div className="w-96 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Current Order
              {orderItems.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearOrder}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items in order</p>
            ) : (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Qty</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead className="w-20">Price</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>₹{item.price * item.quantity}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="h-6 w-6 p-0 text-red-500"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>₹{calculateTax()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{calculateGrandTotal()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Process Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Process Payment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Payment Method</Label>
                          <div className="flex gap-2 mt-2">
                            {['cash', 'card', 'upi'].map(method => (
                              <Button
                                key={method}
                                variant={paymentMethod === method ? "default" : "outline"}
                                onClick={() => setPaymentMethod(method as any)}
                                className="capitalize"
                              >
                                {method}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {paymentMethod === 'cash' && (
                          <div>
                            <Label htmlFor="amount">Amount Received</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={amountReceived}
                              onChange={(e) => setAmountReceived(e.target.value)}
                              placeholder="Enter amount received"
                            />
                            {amountReceived && (
                              <p className="text-sm text-gray-600 mt-1">
                                Change: ₹{Math.max(0, Number(amountReceived) - calculateGrandTotal())}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between font-bold">
                            <span>Total Amount:</span>
                            <span>₹{calculateGrandTotal()}</span>
                          </div>
                        </div>
                        
                        <Button onClick={handlePayment} className="w-full">
                          Complete Payment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="w-full" onClick={printBill}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Bill
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingScreen;
