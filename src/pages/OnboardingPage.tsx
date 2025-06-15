
import React, { useState } from 'react';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, CheckCircle, Store, User, Settings, Rocket } from 'lucide-react';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [onboardingData, setOnboardingData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    role: '',
    
    // Store Info
    storeName: '',
    storeType: '',
    address: '',
    city: '',
    state: '',
    
    // Preferences
    features: [],
    notifications: true,
    setupComplete: false
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to RestaurantOS',
      icon: <Rocket className="h-6 w-6" />,
      description: 'Let\'s get your restaurant management system set up'
    },
    {
      id: 'personal',
      title: 'Personal Information',
      icon: <User className="h-6 w-6" />,
      description: 'Tell us about yourself'
    },
    {
      id: 'store',
      title: 'Store Setup',
      icon: <Store className="h-6 w-6" />,
      description: 'Configure your restaurant details'
    },
    {
      id: 'features',
      title: 'Feature Selection',
      icon: <Settings className="h-6 w-6" />,
      description: 'Choose the features you need'
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      icon: <CheckCircle className="h-6 w-6" />,
      description: 'You\'re all set to start using RestaurantOS'
    }
  ];

  const availableFeatures = [
    { id: 'pos', label: 'Point of Sale', description: 'Manage orders and billing' },
    { id: 'inventory', label: 'Inventory Management', description: 'Track stock and supplies' },
    { id: 'staff', label: 'Staff Management', description: 'Manage employees and schedules' },
    { id: 'analytics', label: 'Analytics & Reports', description: 'Business insights and reporting' },
    { id: 'reservations', label: 'Table Reservations', description: 'Manage table bookings' },
    { id: 'kitchen', label: 'Kitchen Display', description: 'Kitchen order management' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Setup Complete!",
        description: "Welcome to RestaurantOS. Let's get started!"
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Setup failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const getButtons = () => {
    const buttons = [];
    
    if (currentStep > 0 && currentStep < steps.length - 1) {
      buttons.push({
        label: 'Previous',
        onClick: handlePrevious,
        variant: 'outline' as const,
        icon: <ChevronLeft className="h-4 w-4" />
      });
    }
    
    if (currentStep < steps.length - 2) {
      buttons.push({
        label: 'Next',
        onClick: handleNext,
        icon: <ChevronRight className="h-4 w-4" />
      });
    } else if (currentStep === steps.length - 2) {
      buttons.push({
        label: 'Complete Setup',
        onClick: handleComplete,
        icon: <CheckCircle className="h-4 w-4" />,
        loading: loading
      });
    } else if (currentStep === steps.length - 1) {
      buttons.push({
        label: 'Get Started',
        onClick: () => navigate('/'),
        icon: <Rocket className="h-4 w-4" />
      });
    }
    
    return buttons;
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">RestaurantOS</h1>
          <p className="text-gray-600 mt-2">Restaurant Management Suite</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <StandardizedCard size="lg" className="mb-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {steps[currentStep].icon}
              </div>
            </div>
            <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
            <p className="text-gray-600 mt-1">{steps[currentStep].description}</p>
          </div>

          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Welcome! We'll help you set up your restaurant management system in just a few steps.
                This should only take a couple of minutes.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Quick Setup</h3>
                  <p className="text-sm text-blue-700">Get started in under 5 minutes</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900">Customizable</h3>
                  <p className="text-sm text-green-700">Tailor to your restaurant's needs</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={onboardingData.name}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={onboardingData.email}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={onboardingData.phone}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 12345 67890"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Your Role</Label>
                  <Select value={onboardingData.role} onValueChange={(value) => setOnboardingData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Restaurant Owner/Admin</SelectItem>
                      <SelectItem value="manager">Store Manager</SelectItem>
                      <SelectItem value="cashier">Cashier/Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Restaurant Name</Label>
                  <Input
                    id="storeName"
                    value={onboardingData.storeName}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, storeName: e.target.value }))}
                    placeholder="Your restaurant name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Restaurant Type</Label>
                  <Select value={onboardingData.storeType} onValueChange={(value) => setOnboardingData(prev => ({ ...prev, storeType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fine-dining">Fine Dining</SelectItem>
                      <SelectItem value="casual">Casual Dining</SelectItem>
                      <SelectItem value="quick-service">Quick Service</SelectItem>
                      <SelectItem value="cafe">Cafe</SelectItem>
                      <SelectItem value="food-truck">Food Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={onboardingData.address}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={onboardingData.city}
                    onChange={(e) => setOnboardingData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                Select the features you'd like to enable for your restaurant:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {availableFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={feature.id}
                      checked={onboardingData.features.includes(feature.id)}
                      onCheckedChange={() => handleFeatureToggle(feature.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={feature.id} className="font-medium cursor-pointer">
                        {feature.label}
                      </Label>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900">Setup Complete!</h3>
              <p className="text-gray-700">
                Your RestaurantOS is now configured and ready to use. You can always change these settings later.
              </p>
              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <h4 className="font-medium text-green-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Explore your dashboard</li>
                  <li>• Add menu items</li>
                  <li>• Set up your first table</li>
                  <li>• Process your first order</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6">
            <ActionButtonGroup buttons={getButtons()} />
          </div>
        </StandardizedCard>
      </div>
    </div>
  );
};

export default OnboardingPage;
