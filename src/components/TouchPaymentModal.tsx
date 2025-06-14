
import { useState } from 'react';
import { CreditCard, Banknote, Smartphone, Calculator, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TouchPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: () => void;
}

const TouchPaymentModal = ({ isOpen, onClose, total, onPaymentComplete }: TouchPaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('');
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: Banknote, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'card', name: 'Card', icon: CreditCard, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'upi', name: 'UPI', icon: Smartphone, color: 'bg-purple-500 hover:bg-purple-600' },
  ];

  const calculatorButtons = [
    ['7', '8', '9', 'C'],
    ['4', '5', '6', '0'],
    ['1', '2', '3', '.'],
    ['00', 'Set', 'Clear', '←'],
  ];

  const handleCalculatorClick = (value: string) => {
    if (value === 'C' || value === 'Clear') {
      setCalculatorValue('');
    } else if (value === '←') {
      setCalculatorValue(prev => prev.slice(0, -1));
    } else if (value === 'Set') {
      setAmountReceived(calculatorValue);
      setShowCalculator(false);
    } else {
      setCalculatorValue(prev => prev + value);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'cash' && !amountReceived) {
      toast({
        title: "Amount Required",
        description: "Please enter the amount received",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'cash' && Number(amountReceived) < total) {
      toast({
        title: "Insufficient Amount",
        description: "Amount received is less than total",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Successful",
      description: `Order processed via ${paymentMethod}`,
      duration: 2000,
    });
    
    onPaymentComplete();
  };

  const getChange = () => {
    return Math.max(0, Number(amountReceived) - total);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Process Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Amount */}
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-lg text-gray-600 mb-2">Total Amount</p>
              <p className="text-4xl font-bold text-green-600">₹{total}</p>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div>
            <p className="text-lg font-semibold mb-4">Select Payment Method</p>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={paymentMethod === method.id ? "default" : "outline"}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`h-20 flex flex-col gap-2 ${
                      paymentMethod === method.id ? `${method.color} text-white` : ''
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{method.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Cash Payment Input */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold mb-3">Amount Received</p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder="Enter amount received"
                    className="text-xl h-14 text-center"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="h-14 w-14 p-0"
                  >
                    <Calculator className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[total, Math.ceil(total / 100) * 100, 500, 1000].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setAmountReceived(amount.toString())}
                    className="h-12 text-sm"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>

              {/* Change Calculation */}
              {amountReceived && Number(amountReceived) >= total && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Change to Return:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-3 py-1">
                        ₹{getChange()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Calculator */}
              {showCalculator && (
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <Input
                        value={calculatorValue}
                        readOnly
                        className="text-2xl h-12 text-center font-mono"
                        placeholder="0"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {calculatorButtons.flat().map((btn, index) => (
                        <Button
                          key={index}
                          variant={['C', 'Clear', '←', 'Set'].includes(btn) ? "outline" : "default"}
                          onClick={() => handleCalculatorClick(btn)}
                          className={`h-12 text-lg font-semibold ${
                            btn === 'Set' ? 'bg-green-500 hover:bg-green-600 text-white' : ''
                          }`}
                        >
                          {btn}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* UPI/Card Instructions */}
          {paymentMethod !== 'cash' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-blue-800">
                  {paymentMethod === 'upi' 
                    ? 'Please ask customer to scan QR code or share UPI ID' 
                    : 'Please insert or swipe the customer\'s card'
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* Complete Payment Button */}
          <Button 
            onClick={handlePayment} 
            className="w-full h-14 text-xl font-bold bg-green-600 hover:bg-green-700"
            disabled={paymentMethod === 'cash' && (!amountReceived || Number(amountReceived) < total)}
          >
            <Check className="h-6 w-6 mr-3" />
            Complete Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TouchPaymentModal;
