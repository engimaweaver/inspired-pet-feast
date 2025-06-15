
import { useState } from 'react';
import { CreditCard, Printer, QrCode, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  onPaymentComplete: () => void;
}

const PaymentDialog = ({ isOpen, onClose, grandTotal, onPaymentComplete }: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'paytm' | 'phonepe' | 'googlepay'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const { toast } = useToast();

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const paymentMethods = [
    { id: 'cash', name: 'Cash / नकद', icon: '💰' },
    { id: 'card', name: 'Card / कार्ड', icon: '💳' },
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'paytm', name: 'Paytm', icon: '📱' },
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'googlepay', name: 'Google Pay', icon: '📱' },
  ];

  const handlePayment = () => {
    if (paymentMethod === 'cash' && !amountReceived) {
      toast({
        title: "राशि आवश्यक / Amount Required",
        description: "कृपया प्राप्त राशि दर्ज करें / Please enter the amount received",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'cash' && Number(amountReceived) < grandTotal) {
      toast({
        title: "अपर्याप्त राशि / Insufficient Amount",
        description: "प्राप्त राशि कुल से कम है / Amount received is less than total",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "भुगतान सफल / Payment Successful",
      description: `${paymentMethod} के माध्यम से ऑर्डर संसाधित / Order processed via ${paymentMethod}`,
    });
    
    onPaymentComplete();
    setAmountReceived('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>भुगतान करें / Process Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>भुगतान विधि / Payment Method</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {paymentMethods.map(method => (
                <Button
                  key={method.id}
                  variant={paymentMethod === method.id ? "default" : "outline"}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className="h-16 flex flex-col gap-1"
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-xs">{method.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* UPI QR Code Display */}
          {['upi', 'paytm', 'phonepe', 'googlepay'].includes(paymentMethod) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <QrCode className="h-24 w-24 mx-auto mb-2" />
                <p className="text-sm text-blue-800">
                  {paymentMethod.toUpperCase()} से QR कोड स्कैन करें
                </p>
                <p className="text-xs text-gray-600">
                  Scan QR code with {paymentMethod.toUpperCase()} app
                </p>
              </CardContent>
            </Card>
          )}
          
          {paymentMethod === 'cash' && (
            <div>
              <Label htmlFor="amount">प्राप्त राशि / Amount Received</Label>
              <Input
                id="amount"
                type="number"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                placeholder="Enter amount received"
              />
              {amountReceived && Number(amountReceived) >= grandTotal && (
                <p className="text-sm text-green-600 mt-1">
                  वापसी / Change: {formatIndianCurrency(Math.max(0, Number(amountReceived) - grandTotal))}
                </p>
              )}
            </div>
          )}
          
          <div className="bg-gray-50 p-3 rounded">
            <div className="flex justify-between font-bold">
              <span>कुल राशि / Total Amount:</span>
              <span>{formatIndianCurrency(grandTotal)}</span>
            </div>
          </div>
          
          <Button onClick={handlePayment} className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            भुगतान पूरा करें / Complete Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
