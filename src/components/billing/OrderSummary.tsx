
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UnifiedOrderItem } from '@/types/unified-billing';
import { useBillingCalculations } from '@/hooks/useBillingCalculations';
import { formatIndianCurrency } from '@/utils/gstUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDisplayText } from '@/utils/languageUtils';

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
  const { language } = useLanguage();
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
          {getDisplayText('Current Order', 'वर्तमान ऑर्डर', language)}
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
            {getDisplayText('No items in order', 'ऑर्डर में कोई आइटम नहीं', language)}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">{getDisplayText('Qty', 'मात्रा', language)}</TableHead>
                    <TableHead>{getDisplayText('Item', 'वस्तु', language)}</TableHead>
                    <TableHead className="w-20">{getDisplayText('Price', 'मूल्य', language)}</TableHead>
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
                            {getDisplayText('Discount', 'छूट', language)}: {item.discount > 1 ? formatIndianCurrency(item.discount) : item.discount + '%'}
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
                <span>{getDisplayText('Subtotal', 'उप-योग', language)}:</span>
                <span>{formatIndianCurrency(billSummary.subtotal)}</span>
              </div>
              {billSummary.totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{getDisplayText('Discount', 'छूट', language)}:</span>
                  <span>-{formatIndianCurrency(billSummary.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{getDisplayText('CGST', 'सीजीएसटी', language)}:</span>
                <span>{formatIndianCurrency(billSummary.gstBreakdown.cgst)}</span>
              </div>
              <div className="flex justify-between">
                <span>{getDisplayText('SGST', 'एसजीएसटी', language)}:</span>
                <span>{formatIndianCurrency(billSummary.gstBreakdown.sgst)}</span>
              </div>
              {billSummary.gstBreakdown.igst > 0 && (
                <div className="flex justify-between">
                  <span>{getDisplayText('IGST', 'आईजीएसटी', language)}:</span>
                  <span>{formatIndianCurrency(billSummary.gstBreakdown.igst)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>{getDisplayText('Total', 'कुल', language)}:</span>
                <span>{formatIndianCurrency(billSummary.grandTotal)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={onProcessPayment} className="w-full" size="lg">
                {getDisplayText('Process Payment', 'भुगतान करें', language)}
              </Button>
              <Button variant="outline" className="w-full" onClick={onPrintBill}>
                {getDisplayText('Print Bill', 'बिल प्रिंट करें', language)}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
