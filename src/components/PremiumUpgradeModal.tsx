
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, X } from 'lucide-react';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureId?: string;
}

const PremiumUpgradeModal = ({ isOpen, onClose, featureId }: PremiumUpgradeModalProps) => {
  const { premiumPlans, premiumFeatures, currentPlan, upgradePlan, toggleAddOn, enabledAddOns } = usePremiumFeatures();
  
  const targetFeature = featureId ? premiumFeatures.find(f => f.id === featureId) : null;

  const handleUpgrade = (planId: string) => {
    upgradePlan(planId);
    onClose();
  };

  const handleAddOnToggle = (addOnId: string) => {
    toggleAddOn(addOnId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <DialogTitle>Upgrade to Premium</DialogTitle>
          </div>
          <DialogDescription>
            {targetFeature 
              ? `Unlock ${targetFeature.name} and other premium features`
              : 'Choose the perfect plan for your restaurant'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">Current Plan: {currentPlan.name}</h3>
            <p className="text-sm text-blue-700">
              ${currentPlan.price}/month {currentPlan.price === 0 && '(Free)'}
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {premiumPlans.map((plan) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-6 ${
                  plan.id === currentPlan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="text-3xl font-bold text-gray-900">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {plan.features.map((featureId) => {
                    const feature = premiumFeatures.find(f => f.id === featureId);
                    return (
                      <div key={featureId} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          {feature?.name || featureId.replace('-', ' ')}
                        </span>
                      </div>
                    );
                  })}
                  
                  {plan.addOns.map((addOnId) => {
                    const addOn = premiumFeatures.find(f => f.id === addOnId);
                    return (
                      <div key={addOnId} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          {addOn?.name || addOnId.replace('-', ' ')}
                        </span>
                        <Badge variant="secondary" className="text-xs">Included</Badge>
                      </div>
                    );
                  })}
                </div>

                <Button
                  className="w-full"
                  variant={plan.id === currentPlan.id ? "secondary" : "default"}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.id === currentPlan.id}
                >
                  {plan.id === currentPlan.id ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            ))}
          </div>

          {/* Add-ons Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Available Add-ons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premiumFeatures.filter(f => f.isAddOn && !currentPlan.addOns.includes(f.id)).map((addOn) => (
                <div key={addOn.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{addOn.name}</h4>
                    <Badge className="bg-purple-100 text-purple-800">
                      ${addOn.price}/month
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{addOn.description}</p>
                  <Button
                    size="sm"
                    variant={enabledAddOns.includes(addOn.id) ? "secondary" : "default"}
                    onClick={() => handleAddOnToggle(addOn.id)}
                  >
                    {enabledAddOns.includes(addOn.id) ? 'Remove' : 'Add'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgradeModal;
