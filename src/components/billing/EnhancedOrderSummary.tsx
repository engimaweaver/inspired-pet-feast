
import { useState } from 'react';
import { Plus, Minus, Trash2, CreditCard, Printer, ShoppingCart, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { OrderItem } from '@/types/billing';
import { formatIndianCurrency } from '@/utils/currencyUtils';
import { calculateBillingTotals } from '@/utils/billingCalculations';
import { useSimplifiedBillManager } from './SimplifiedBillManager';

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
  onUpdateItems,
}: EnhancedOrderSummaryProps) => {
  const { activeBill } = useSimplifiedBillManager();
  const { toast } = useToast();

  const billingTotals = calculateBillingTotals(orderItems);
  const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleClearOrder = () => {
    if (orderItems.length === 0) {
      toast({
        title: "कोई आइटम नहीं / No Items",
        description: "साफ़ करने के लिए कोई आइटम नहीं / No items to clear",
        variant: "destructive",
      });
      return;
    }
    onClearOrder();
  };

  const handleProcessPayment = () => {
    if (orderItems.length === 0) {
      toast({
        title: "कोई आइटम नहीं / No Items",
        description: "भुगतान के लिए कृपया आइटम जोड़ें / Please add items for payment",
        variant: "destructive",
      });
      return;
    }
    onProcessPayment();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>ऑर्डर सारांश / Order Summary</span>
          </div>
          {activeBill && (
            <Badge variant="outline" className="text-xs">
              {activeBill.name}
            </Badge>
          )}
        </CardTitle>
        {itemCount > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{itemCount} आइटम / items</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearOrder}
              className="text-red-500 hover:text-red-700 h-8"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              साफ़ करें / Clear
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {orderItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center p-6">
            <div>
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 mb-1">कोई आइटम चयनित नहीं / No items selected</p>
              <p className="text-sm text-gray-400">मेन्यू से आइटम जोड़ें / Add items from menu</p>
            </div>
          </div>
        ) : (
          <>
            {/* Order Items List */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3 pb-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">{formatIndianCurrency(item.price)} प्रत्येक / each</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="h-7 w-7 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="h-7 w-7 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-semibold text-green-600">
                        {formatIndianCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Order Totals */}
            <div className="border-t bg-white p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>उप-योग / Subtotal:</span>
                  <span>{formatIndianCurrency(billingTotals.subtotal)}</span>
                </div>
                {billingTotals.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>छूट / Discount:</span>
                    <span>-{formatIndianCurrency(billingTotals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>जीएसटी / GST:</span>
                  <span>{formatIndianCurrency(billingTotals.gstAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>कुल / Total:</span>
                  <span className="text-green-600">{formatIndianCurrency(billingTotals.grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  onClick={handleProcessPayment}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  भुगतान करें / Process Payment
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onPrintBill}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  बिल प्रिंट करें / Print Bill
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedOrderSummary;
