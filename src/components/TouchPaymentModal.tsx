
import { useState } from 'react';
import { CreditCard, Banknote, Smartphone, Calculator, Check, QrCode } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'paytm' | 'phonepe' | 'googlepay'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('');
  const { toast } = useToast();

  // Indian payment methods with proper icons and colors
  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: Banknote, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'card', name: 'Card', icon: CreditCard, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'upi', name: 'UPI', icon: QrCode, color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'paytm', name: 'Paytm', icon: Smartphone, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'phonepe', name: 'PhonePe', icon: Smartphone, color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'googlepay', name: 'Google Pay', icon: Smartphone, color: 'bg-red-500 hover:bg-red-600' },
  ];

  // Indian denomination breakdown for cash
  const denominations = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

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
        title: "राशि आवश्यक / Amount Required",
        description: "कृपया प्राप्त राशि दर्ज करें / Please enter the amount received",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'cash' && Number(amountReceived) < total) {
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
      duration: 2000,
    });
    
    onPaymentComplete();
  };

  const getChange = () => {
    return Math.max(0, Number(amountReceived) - total);
  };

  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDenominationBreakdown = (amount: number) => {
    const breakdown: { [key: number]: number } = {};
    let remaining = amount;

    denominations.forEach(denom => {
      if (remaining >= denom) {
        breakdown[denom] = Math.floor(remaining / denom);
        remaining = remaining % denom;
      }
    });

    return breakdown;
  };

  const generateUPIQR = () => {
    // Simplified UPI QR code data (in real implementation, use proper UPI URL format)
    return `upi://pay?pa=merchant@upi&pn=Restaurant&am=${total}&cu=INR&tn=Bill Payment`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            भुगतान करें / Process Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Amount */}
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-lg text-gray-600 mb-2">कुल राशि / Total Amount</p>
              <p className="text-4xl font-bold text-green-600">{formatIndianCurrency(total)}</p>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div>
            <p className="text-lg font-semibold mb-4">भुगतान विधि चुनें / Select Payment Method</p>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={paymentMethod === method.id ? "default" : "outline"}
                    onClick={() => {
                      setPaymentMethod(method.id as any);
                      if (method.id === 'upi') {
                        setShowQR(true);
                      } else {
                        setShowQR(false);
                      }
                    }}
                    className={`h-16 flex flex-col gap-1 ${
                      paymentMethod === method.id ? `${method.color} text-white` : ''
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{method.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* UPI QR Code */}
          {['upi', 'paytm', 'phonepe', 'googlepay'].includes(paymentMethod) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="bg-white p-4 rounded-lg mb-4 inline-block">
                  <QrCode className="h-32 w-32 mx-auto" />
                  <p className="text-xs mt-2 text-gray-600">QR Code for {paymentMethod.toUpperCase()}</p>
                </div>
                <p className="text-blue-800 text-sm">
                  {paymentMethod === 'upi' 
                    ? 'कृपया UPI ऐप से QR कोड स्कैन करें / Please scan QR code with UPI app'
                    : `कृपया ${paymentMethod} ऐप से QR कोड स्कैन करें / Please scan QR code with ${paymentMethod} app`
                  }
                </p>
                <p className="text-xs text-gray-600 mt-2">Amount: {formatIndianCurrency(total)}</p>
              </CardContent>
            </Card>
          )}

          {/* Cash Payment Input */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold mb-3">प्राप्त राशि / Amount Received</p>
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

              {/* Quick Amount Buttons with Indian denominations */}
              <div className="grid grid-cols-4 gap-2">
                {[total, Math.ceil(total / 100) * 100, 500, 1000].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setAmountReceived(amount.toString())}
                    className="h-12 text-sm"
                  >
                    {formatIndianCurrency(amount)}
                  </Button>
                ))}
              </div>

              {/* Change Calculation with Denomination Breakdown */}
              {amountReceived && Number(amountReceived) >= total && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-semibold">वापसी / Change to Return:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-3 py-1">
                        {formatIndianCurrency(getChange())}
                      </Badge>
                    </div>
                    
                    {/* Denomination breakdown */}
                    {getChange() > 0 && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p className="text-sm font-medium mb-2">नोट/सिक्के का विवरण / Denomination Breakdown:</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {Object.entries(getDenominationBreakdown(getChange())).map(([denom, count]) => (
                            <div key={denom} className="flex justify-between bg-gray-50 p-1 rounded">
                              <span>₹{denom}:</span>
                              <span>{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

          {/* Card Instructions */}
          {paymentMethod === 'card' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-blue-800">
                  कृपया ग्राहक का कार्ड डालें या स्वाइप करें / Please insert or swipe the customer's card
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
            भुगतान पूरा करें / Complete Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TouchPaymentModal;
