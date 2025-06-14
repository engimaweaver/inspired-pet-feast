
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
  },
  // Phase 3A: Financial Analytics
  {
    id: 'financial-analytics',
    name: 'Financial Analytics',
    description: 'Advanced financial reporting and profit analysis',
    isAddOn: true,
    price: 49,
    enabled: false
  },
  {
    id: 'cost-management',
    name: 'Cost Management',
    description: 'Food cost tracking and optimization',
    isAddOn: true,
    price: 35,
    enabled: false
  },
  // Phase 3B: Customer Feedback
  {
    id: 'customer-feedback',
    name: 'Customer Feedback System',
    description: 'Review management and customer satisfaction tracking',
    isAddOn: true,
    price: 25,
    enabled: false
  },
  {
    id: 'review-management',
    name: 'Review Management',
    description: 'Automated review monitoring and response system',
    isAddOn: true,
    price: 30,
    enabled: false
  },
  // Phase 3C: Marketing Tools
  {
    id: 'marketing-campaigns',
    name: 'Marketing Campaigns',
    description: 'Email marketing and promotional campaign management',
    isAddOn: true,
    price: 40,
    enabled: false
  },
  {
    id: 'social-media',
    name: 'Social Media Integration',
    description: 'Social media management and posting tools',
    isAddOn: true,
    price: 35,
    enabled: false
  },
  // Phase 3D: Advanced Reporting
  {
    id: 'advanced-reporting',
    name: 'Advanced Reporting Dashboard',
    description: 'Executive-level reporting and business intelligence',
    isAddOn: true,
    price: 60,
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
  },
  {
    id: 'business-intelligence',
    name: 'Business Intelligence',
    price: 299,
    features: ['dashboard', 'billing', 'menu', 'inventory', 'kitchen', 'advanced-analytics', 'multi-store'],
    addOns: ['customer-loyalty', 'ai-recommendations', 'financial-analytics', 'cost-management', 'customer-feedback', 'review-management', 'marketing-campaigns', 'social-media', 'advanced-reporting']
  }
];

export const usePremiumFeatures = () => {
  // Start with Enterprise plan instead of Basic
  const [currentPlan, setCurrentPlan] = useState<PremiumPlan>(PREMIUM_PLANS[2]); // Enterprise plan
  // Enable all add-ons by default for testing
  const [enabledAddOns, setEnabledAddOns] = useState<string[]>(['customer-loyalty', 'ai-recommendations', 'financial-analytics', 'cost-management', 'customer-feedback', 'review-management', 'marketing-campaigns', 'social-media', 'advanced-reporting']);

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
