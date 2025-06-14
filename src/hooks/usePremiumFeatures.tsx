
import { useState, useEffect } from 'react';

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isAddOn: boolean;
  price: number;
  enabled: boolean;
}

export interface PremiumPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  addOns: string[];
}

const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: 'customer-loyalty',
    name: 'Customer Loyalty Program',
    description: 'Advanced customer loyalty and rewards management',
    isAddOn: true,
    price: 29,
    enabled: false
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Detailed reporting and business insights',
    isAddOn: false,
    price: 0,
    enabled: false
  },
  {
    id: 'multi-store',
    name: 'Multi-Store Management',
    description: 'Manage multiple restaurant locations',
    isAddOn: false,
    price: 0,
    enabled: false
  },
  {
    id: 'ai-recommendations',
    name: 'AI Recommendations',
    description: 'Smart menu and business recommendations',
    isAddOn: true,
    price: 39,
    enabled: false
  }
];

const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    features: ['dashboard', 'billing', 'menu', 'inventory', 'kitchen'],
    addOns: []
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    features: ['dashboard', 'billing', 'menu', 'inventory', 'kitchen', 'advanced-analytics', 'multi-store'],
    addOns: []
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    features: ['dashboard', 'billing', 'menu', 'inventory', 'kitchen', 'advanced-analytics', 'multi-store'],
    addOns: ['customer-loyalty', 'ai-recommendations']
  }
];

export const usePremiumFeatures = () => {
  // Start with Enterprise plan instead of Basic
  const [currentPlan, setCurrentPlan] = useState<PremiumPlan>(PREMIUM_PLANS[2]); // Enterprise plan
  // Enable all add-ons by default for testing
  const [enabledAddOns, setEnabledAddOns] = useState<string[]>(['customer-loyalty', 'ai-recommendations']);

  const isFeatureEnabled = (featureId: string): boolean => {
    return currentPlan.features.includes(featureId) || 
           currentPlan.addOns.includes(featureId) ||
           enabledAddOns.includes(featureId);
  };

  const isFeaturePremium = (featureId: string): boolean => {
    const feature = PREMIUM_FEATURES.find(f => f.id === featureId);
    return feature ? !currentPlan.features.includes(featureId) : false;
  };

  const getFeatureInfo = (featureId: string): PremiumFeature | null => {
    return PREMIUM_FEATURES.find(f => f.id === featureId) || null;
  };

  const toggleAddOn = (addOnId: string) => {
    setEnabledAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const upgradePlan = (planId: string) => {
    const plan = PREMIUM_PLANS.find(p => p.id === planId);
    if (plan) {
      setCurrentPlan(plan);
    }
  };

  return {
    currentPlan,
    enabledAddOns,
    premiumFeatures: PREMIUM_FEATURES,
    premiumPlans: PREMIUM_PLANS,
    isFeatureEnabled,
    isFeaturePremium,
    getFeatureInfo,
    toggleAddOn,
    upgradePlan
  };
};
