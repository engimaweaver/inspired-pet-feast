
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UnifiedOrderItem } from '@/types/unified-billing';
import { useBillingCalculations } from '@/hooks/useBillingCalculations';
import { formatIndianCurrency } from '@/utils/gstUtils';

interface OrderSummaryProps {
  orderItems: UnifiedOrderItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onClearOrder: () => void;
  onProcessPayment: () => void;
  onPrintBill: () => void;
}

const OrderSummary = ({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  onProcessPayment,
  onPrintBill
}: OrderSummaryProps) => {
  const billSummary = useBillingCalculations(orderItems);

  const calculateItemTotal = (item: UnifiedOrderItem) => {
    const baseTotal = item.price * item.quantity;
    if (!item.discount) return baseTotal;
    
    const discountAmount = item.discount > 1 ? item.discount : (baseTotal * item.discount / 100);
    return Math.max(0, baseTotal - discountAmount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          वर्तमान ऑर्डर / Current Order
          {orderItems.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClearOrder}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orderItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            ऑर्डर में कोई आइटम नहीं / No items in order
          </p>
        ) : (
          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">मात्रा / Qty</TableHead>
                    <TableHead>वस्तु / Item</TableHead>
                    <TableHead className="w-20">मूल्य / Price</TableHead>
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
                            Discount: {item.discount > 1 ? formatIndianCurrency(item.discount) : item.discount + '%'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatIndianCurrency(calculateItemTotal(item))}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveItem(item.id)}
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

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>उप-योग / Subtotal:</span>
                <span>{formatIndianCurrency(billSummary.subtotal)}</span>
              </div>
              {billSummary.totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>छूट / Discount:</span>
                  <span>-{formatIndianCurrency(billSummary.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>सीजीएसटी / CGST:</span>
                <span>{formatIndianCurrency(billSummary.gstBreakdown.cgst)}</span>
              </div>
              <div className="flex justify-between">
                <span>एसजीएसटी / SGST:</span>
                <span>{formatIndianCurrency(billSummary.gstBreakdown.sgst)}</span>
              </div>
              {billSummary.gstBreakdown.igst > 0 && (
                <div className="flex justify-between">
                  <span>आईजीएसटी / IGST:</span>
                  <span>{formatIndianCurrency(billSummary.gstBreakdown.igst)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>कुल / Total:</span>
                <span>{formatIndianCurrency(billSummary.grandTotal)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={onProcessPayment} className="w-full" size="lg">
                भुगतान करें / Process Payment
              </Button>
              <Button variant="outline" className="w-full" onClick={onPrintBill}>
                बिल प्रिंट करें / Print Bill
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
