
import { useState } from 'react';
import { Plus, Minus, Trash2, Edit3, Percent, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrderItem } from '@/types/billing';
import { useBillManager } from './BillManager';
import { useToast } from '@/hooks/use-toast';

interface EnhancedOrderSummaryProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  onProcessPayment: () => void;
  onPrintBill: () => void;
  onUpdateItems: (items: OrderItem[]) => void;
}

const EnhancedOrderSummary = ({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  onProcessPayment,
  onPrintBill,
  onUpdateItems
}: EnhancedOrderSummaryProps) => {
  const { activeBill, updateCustomerInfo } = useBillManager();
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [splitBillDialogOpen, setSplitBillDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'amount'>('percent');
  const [splitCount, setSplitCount] = useState(2);
  const [customerName, setCustomerName] = useState(activeBill?.customerInfo?.name || '');
  const [customerPhone, setCustomerPhone] = useState(activeBill?.customerInfo?.phone || '');
  const [customerNotes, setCustomerNotes] = useState('');
  const { toast } = useToast();

  const applyDiscount = () => {
    if (!selectedItemId || !discountValue) return;

    const discount = parseFloat(discountValue);
    if (isNaN(discount) || discount < 0) return;

    const updatedItems = orderItems.map(item => {
      if (item.id === selectedItemId) {
        const maxDiscount = discountType === 'percent' ? 100 : item.price;
        const finalDiscount = Math.min(discount, maxDiscount);
        return { ...item, discount: finalDiscount };
      }
      return item;
    });

    onUpdateItems(updatedItems);
    setDiscountDialogOpen(false);
    setDiscountValue('');
    toast({
      title: "Discount Applied",
      description: `Discount of ${discountType === 'percent' ? discount + '%' : '₹' + discount} applied`,
    });
  };

  const splitBill = () => {
    if (splitCount < 2 || splitCount > orderItems.length) return;

    const itemsPerBill = Math.ceil(orderItems.length / splitCount);
    const splitBills = [];

    for (let i = 0; i < splitCount; i++) {
      const startIndex = i * itemsPerBill;
      const endIndex = Math.min(startIndex + itemsPerBill, orderItems.length);
      const billItems = orderItems.slice(startIndex, endIndex);
      
      if (billItems.length > 0) {
        splitBills.push(billItems);
      }
    }

    // Here you would create new bills for each split
    setSplitBillDialogOpen(false);
    toast({
      title: "Bill Split",
      description: `Bill split into ${splitBills.length} parts`,
    });
  };

  const updateCustomerDetails = () => {
    if (activeBill) {
      updateCustomerInfo(activeBill.id, {
        ...activeBill.customerInfo,
        name: customerName,
        phone: customerPhone,
      });
    }
    setCustomerDialogOpen(false);
    toast({
      title: "Customer Info Updated",
      description: "Customer details saved successfully",
    });
  };

  const bulkUpdateQuantity = (multiplier: number) => {
    const updatedItems = orderItems.map(item => ({
      ...item,
      quantity: Math.max(1, Math.round(item.quantity * multiplier))
    }));
    onUpdateItems(updatedItems);
    toast({
      title: "Quantities Updated",
      description: `All quantities ${multiplier > 1 ? 'increased' : 'decreased'} by ${Math.abs(multiplier - 1) * 100}%`,
    });
  };

  const calculateItemTotal = (item: OrderItem) => {
    const baseTotal = item.price * item.quantity;
    if (!item.discount) return baseTotal;
    
    const discountAmount = item.discount > 1 ? item.discount : (baseTotal * item.discount / 100);
    return Math.max(0, baseTotal - discountAmount);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateTax = () => {
    return Math.round(calculateTotal() * 0.18);
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const addCustomItem = () => {
    const customItem: OrderItem = {
      id: `custom-${Date.now()}`,
      name: 'Custom Item',
      price: 0,
      quantity: 1,
      category: 'Custom'
    };
    onUpdateItems([...orderItems, customItem]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Order Summary</span>
          <div className="flex gap-2">
            <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </Dialog>
            {orderItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={onClearOrder}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orderItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No items in order</p>
            <Button onClick={addCustomItem} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bulk Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => bulkUpdateQuantity(2)}>
                Double All
              </Button>
              <Button size="sm" variant="outline" onClick={() => bulkUpdateQuantity(0.5)}>
                Half All
              </Button>
              <Button size="sm" variant="outline" onClick={addCustomItem}>
                <Plus className="h-3 w-3 mr-1" />
                Custom
              </Button>
              <Dialog open={splitBillDialogOpen} onOpenChange={setSplitBillDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    Split
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Qty</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-20">Price</TableHead>
                    <TableHead className="w-16">Action</TableHead>
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
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        {item.discount && (
                          <div className="text-xs text-green-600">
                            Discount: {item.discount > 1 ? '₹' + item.discount : item.discount + '%'}
                          </div>
                        )}
                        {item.notes && (
                          <div className="text-xs text-gray-500">{item.notes}</div>
                        )}
                      </TableCell>
                      <TableCell>₹{calculateItemTotal(item)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog open={discountDialogOpen && selectedItemId === item.id} onOpenChange={setDiscountDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedItemId(item.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Percent className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveItem(item.id)}
                            className="h-6 w-6 p-0 text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

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

            <div className="space-y-2">
              <Button onClick={onProcessPayment} className="w-full" size="lg">
                Process Payment
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={onPrintBill}>
                  <FileText className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Discount Dialog */}
        <Dialog open={discountDialogOpen} onOpenChange={setDiscountDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply Discount</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Discount Type</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={discountType === 'percent' ? 'default' : 'outline'}
                    onClick={() => setDiscountType('percent')}
                  >
                    Percentage
                  </Button>
                  <Button
                    variant={discountType === 'amount' ? 'default' : 'outline'}
                    onClick={() => setDiscountType('amount')}
                  >
                    Fixed Amount
                  </Button>
                </div>
              </div>
              <div>
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'percent' ? 'Enter percentage' : 'Enter amount'}
                />
              </div>
              <Button onClick={applyDiscount} className="w-full">
                Apply Discount
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Split Bill Dialog */}
        <Dialog open={splitBillDialogOpen} onOpenChange={setSplitBillDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Split Bill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Number of Bills</Label>
                <Input
                  type="number"
                  min="2"
                  max={orderItems.length}
                  value={splitCount}
                  onChange={(e) => setSplitCount(parseInt(e.target.value) || 2)}
                />
              </div>
              <Button onClick={splitBill} className="w-full">
                Split Bill
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Customer Info Dialog */}
        <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customer Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Customer Name</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Special instructions or notes"
                />
              </div>
              <Button onClick={updateCustomerDetails} className="w-full">
                Save Customer Info
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EnhancedOrderSummary;
