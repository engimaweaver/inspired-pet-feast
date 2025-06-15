
import { useState } from 'react';
import { CreditCard, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  onPaymentComplete: () => void;
}

const PaymentDialog = ({ isOpen, onClose, grandTotal, onPaymentComplete }: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const { toast } = useToast();

  const handlePayment = () => {
    if (paymentMethod === 'cash' && !amountReceived) {
      toast({
        title: "Amount Required",
        description: "Please enter the amount received",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Successful",
      description: `Order processed via ${paymentMethod}`,
    });
    
    onPaymentComplete();
    setAmountReceived('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  Change: ₹{Math.max(0, Number(amountReceived) - grandTotal)}
                </p>
              )}
            </div>
          )}
          
          <div className="bg-gray-50 p-3 rounded">
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
          
          <Button onClick={handlePayment} className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Complete Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
