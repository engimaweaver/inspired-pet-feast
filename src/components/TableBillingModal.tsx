
import { useState } from 'react';
import { Plus, Minus, Trash2, CreditCard, Users, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Table as TableType } from './FloorPlanScreen';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface TableBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableType;
  onUpdateTable: (table: TableType) => void;
}

const TableBillingModal = ({ isOpen, onClose, table, onUpdateTable }: TableBillingModalProps) => {
  const { toast } = useToast();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Sample menu items
  const menuItems = [
    { id: '1', name: 'Butter Chicken', price: 320, category: 'Main Course' },
    { id: '2', name: 'Dal Makhani', price: 180, category: 'Main Course' },
    { id: '3', name: 'Chicken Biryani', price: 380, category: 'Rice' },
    { id: '4', name: 'Paneer Tikka', price: 280, category: 'Starter' },
    { id: '5', name: 'Garlic Naan', price: 80, category: 'Bread' },
    { id: '6', name: 'Masala Chai', price: 40, category: 'Beverages' },
  ];

  const addToOrder = (menuItem: any) => {
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

  const handleStartService = () => {
    if (table.status === 'available' && orderItems.length > 0) {
      const updatedTable: TableType = {
        ...table,
        status: 'occupied',
        currentBill: {
          id: `bill-${table.id}-${Date.now()}`,
          items: orderItems,
          total: calculateGrandTotal(),
          startTime: new Date().toISOString()
        }
      };
      onUpdateTable(updatedTable);
      toast({
        title: "Service Started",
        description: `Table ${table.number} is now occupied`,
      });
    }
  };

  const handleCompletePayment = () => {
    if (orderItems.length === 0) {
      toast({
        title: "No Items",
        description: "Please add items to complete payment",
        variant: "destructive",
      });
      return;
    }

    const updatedTable: TableType = {
      ...table,
      status: 'cleaning',
      currentBill: undefined
    };
    onUpdateTable(updatedTable);
    setOrderItems([]);
    
    toast({
      title: "Payment Completed",
      description: `Table ${table.number} payment processed successfully`,
    });
    onClose();
  };

  const getElapsedTime = () => {
    if (!table.currentBill?.startTime) return null;
    const start = new Date(table.currentBill.startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Table {table.number} - {table.seats} seats</span>
              <Badge variant={table.status === 'occupied' ? 'destructive' : 'secondary'}>
                {table.status}
              </Badge>
            </div>
            {table.currentBill && getElapsedTime() && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {getElapsedTime()}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6">
          {/* Left Panel - Menu Items */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold">Menu Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {menuItems.map(item => (
                <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
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
                      Add
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Panel - Current Order */}
          <div className="w-96 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Current Order
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
                            <TableHead className="w-16">Qty</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead className="w-20">Total</TableHead>
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
                                  <span className="w-6 text-center text-sm">{item.quantity}</span>
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
                              <TableCell>
                                <div>
                                  <div className="font-medium text-sm">{item.name}</div>
                                  <div className="text-xs text-gray-500">₹{item.price} each</div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">₹{item.price * item.quantity}</TableCell>
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
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
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
                      {table.status === 'available' ? (
                        <Button 
                          className="w-full" 
                          onClick={handleStartService}
                          disabled={orderItems.length === 0}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Start Service
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={handleCompletePayment}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Complete Payment
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableBillingModal;
