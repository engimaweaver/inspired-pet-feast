
import { useState } from 'react';
import { CreditCard, Banknote, Smartphone, Calculator, Check, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { StandardizedDialog } from '@/components/ui/standardized-dialog';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { formatIndianCurrency } from '@/utils/currencyUtils';

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
  const [calculatorValue, setCalculatorValue] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: Banknote, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'card', name: 'Card', icon: CreditCard, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'upi', name: 'UPI', icon: QrCode, color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'paytm', name: 'Paytm', icon: Smartphone, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'phonepe', name: 'PhonePe', icon: Smartphone, color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'googlepay', name: 'Google Pay', icon: Smartphone, color: 'bg-red-500 hover:bg-red-600' },
  ];

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

  const handlePayment = async () => {
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

    setProcessing(true);
    
    setTimeout(() => {
      toast({
        title: "भुगतान सफल / Payment Successful",
        description: `${paymentMethod} के माध्यम से ऑर्डर संसाधित / Order processed via ${paymentMethod}`,
        duration: 2000,
      });
      
      onPaymentComplete();
      setProcessing(false);
    }, 1500);
  };

  const getChange = () => {
    return Math.max(0, Number(amountReceived) - total);
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

  const paymentActionButtons = [
    {
      label: 'भुगतान पूरा करें / Complete Payment',
      onClick: handlePayment,
      disabled: paymentMethod === 'cash' && (!amountReceived || Number(amountReceived) < total),
      loading: processing,
      icon: <Check className="h-5 w-5" />,
      variant: 'default' as const,
    },
  ];

  return (
    <StandardizedDialog
      isOpen={isOpen}
      onClose={onClose}
      title="भुगतान करें / Process Payment"
      size="md"
      loading={processing}
    >
      <div className="space-y-6">
        {/* Total Amount */}
        <StandardizedCard className="bg-gray-50">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-2">कुल राशि / Total Amount</p>
            <p className="text-4xl font-bold text-green-600">{formatIndianCurrency(total)}</p>
          </div>
        </StandardizedCard>

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
                    if (method.id !== 'upi') {
                      // Reset amount when switching from cash
                      if (paymentMethod === 'cash') {
                        setAmountReceived('');
                      }
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
          <StandardizedCard 
            className="bg-blue-50 border-blue-200"
            title={`${paymentMethod.toUpperCase()} Payment`}
          >
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg mb-4 inline-block">
                <QrCode className="h-32 w-32 mx-auto" />
                <p className="text-xs mt-2 text-gray-600">QR Code for {paymentMethod.toUpperCase()}</p>
              </div>
              <p className="text-blue-800 text-sm">
                कृपया QR कोड स्कैन करें / Please scan QR code with app
              </p>
              <p className="text-xs text-gray-600 mt-2">Amount: {formatIndianCurrency(total)}</p>
            </div>
          </StandardizedCard>
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

            {/* Quick Amount Buttons */}
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

            {/* Change Calculation */}
            {amountReceived && Number(amountReceived) >= total && (
              <StandardizedCard 
                className="bg-green-50 border-green-200"
                title="वापसी / Change to Return"
                badge={{
                  text: formatIndianCurrency(getChange()),
                  variant: 'secondary',
                }}
              >
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
              </StandardizedCard>
            )}

            {/* Calculator */}
            {showCalculator && (
              <StandardizedCard title="Calculator">
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
              </StandardizedCard>
            )}
          </div>
        )}

        {/* Card Instructions */}
        {paymentMethod === 'card' && (
          <StandardizedCard className="bg-blue-50 border-blue-200">
            <p className="text-blue-800 text-center">
              कृपया ग्राहक का कार्ड डालें या स्वाइप करें / Please insert or swipe the customer's card
            </p>
          </StandardizedCard>
        )}

        {/* Payment Actions */}
        <ActionButtonGroup
          buttons={paymentActionButtons}
          orientation="horizontal"
          size="lg"
          className="w-full"
        />
      </div>
    </StandardizedDialog>
  );
};

export default TouchPaymentModal;
