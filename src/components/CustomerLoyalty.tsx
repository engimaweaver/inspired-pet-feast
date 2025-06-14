import { useState } from 'react';
import { Star, Gift, Users, TrendingUp, Award, CreditCard, Phone, Mail, Crown, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import PremiumUpgradeModal from './PremiumUpgradeModal';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  visits: number;
  lastVisit: string;
  joinDate: string;
  favoriteItems: string[];
}

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerDollar: number;
  tiers: {
    name: string;
    minPoints: number;
    benefits: string[];
    color: string;
  }[];
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    points: 2850,
    tier: 'Gold',
    totalSpent: 1425,
    visits: 28,
    lastVisit: '2024-06-13',
    joinDate: '2024-01-15',
    favoriteItems: ['Caesar Salad', 'Grilled Salmon', 'Tiramisu']
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1 (555) 987-6543',
    points: 1200,
    tier: 'Silver',
    totalSpent: 600,
    visits: 15,
    lastVisit: '2024-06-12',
    joinDate: '2024-03-01',
    favoriteItems: ['Margherita Pizza', 'Garlic Bread']
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '+1 (555) 456-7890',
    points: 450,
    tier: 'Bronze',
    totalSpent: 225,
    visits: 8,
    lastVisit: '2024-06-10',
    joinDate: '2024-05-10',
    favoriteItems: ['Chicken Wrap', 'Smoothie Bowl']
  }
];

const loyaltyProgram: LoyaltyProgram = {
  id: '1',
  name: 'Taste Rewards',
  description: 'Earn points with every purchase and unlock exclusive rewards',
  pointsPerDollar: 2,
  tiers: [
    {
      name: 'Bronze',
      minPoints: 0,
      benefits: ['2 points per $1', 'Birthday reward'],
      color: 'bg-amber-600'
    },
    {
      name: 'Silver',
      minPoints: 500,
      benefits: ['2 points per $1', '5% discount', 'Priority seating'],
      color: 'bg-gray-400'
    },
    {
      name: 'Gold',
      minPoints: 1500,
      benefits: ['3 points per $1', '10% discount', 'Free appetizer monthly'],
      color: 'bg-yellow-500'
    },
    {
      name: 'Platinum',
      minPoints: 3000,
      benefits: ['4 points per $1', '15% discount', 'Exclusive menu access'],
      color: 'bg-purple-600'
    }
  ]
};

const CustomerLoyalty = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const { isFeatureEnabled } = usePremiumFeatures();
  const hasLoyaltyAccess = isFeatureEnabled('customer-loyalty');

  // If premium feature is not enabled, show upgrade prompt
  if (!hasLoyaltyAccess) {
    return (
      <>
        <div className="p-6 space-y-6">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-6">
              <Lock className="h-12 w-12 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Loyalty Program</h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Unlock advanced customer loyalty and rewards management with our premium add-on
            </p>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-purple-600 mr-3" />
                <Badge className="bg-purple-600 text-white px-4 py-2">Premium Add-on</Badge>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What's included in Customer Loyalty:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {[
                  'Advanced customer tracking',
                  'Points & rewards system',
                  'Tier-based benefits',
                  'Customer analytics',
                  'Automated campaigns',
                  'Custom loyalty rules',
                  'Birthday & anniversary rewards',
                  'Integration with POS system'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Star className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border-2 border-purple-200">
                <div className="text-center">
                  <span className="text-3xl font-bold text-purple-600">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Add to any plan</p>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => setShowUpgradeModal(true)}
            >
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to Access Customer Loyalty
            </Button>
          </div>
        </div>
        
        <PremiumUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          featureId="customer-loyalty"
        />
      </>
    );
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getTierColor = (tier: string) => {
    const tierData = loyaltyProgram.tiers.find(t => t.name === tier);
    return tierData?.color || 'bg-gray-400';
  };

  const getNextTier = (customer: Customer) => {
    const currentTierIndex = loyaltyProgram.tiers.findIndex(t => t.name === customer.tier);
    if (currentTierIndex < loyaltyProgram.tiers.length - 1) {
      return loyaltyProgram.tiers[currentTierIndex + 1];
    }
    return null;
  };

  const addPoints = (customerId: string, points: number) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const newPoints = customer.points + points;
        // Determine new tier based on points
        let newTier = customer.tier;
        for (let i = loyaltyProgram.tiers.length - 1; i >= 0; i--) {
          if (newPoints >= loyaltyProgram.tiers[i].minPoints) {
            newTier = loyaltyProgram.tiers[i].name as any;
            break;
          }
        }
        return { ...customer, points: newPoints, tier: newTier };
      }
      return customer;
    }));
  };

  const totalCustomers = customers.length;
  const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
  const averageSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-purple-600" />
            <Badge className="bg-purple-600 text-white">Premium Add-on</Badge>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Loyalty Program</h1>
            <p className="text-gray-600">Manage your customer rewards and loyalty program</p>
          </div>
        </div>
        <Button onClick={() => setIsAddCustomerOpen(true)}>
          <Users className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="program">Program Settings</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Customer Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${averageSpent.toFixed(0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gold+ Members</CardTitle>
                <Award className="h-4 w-4 text-gold-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customers.filter(c => c.tier === 'Gold' || c.tier === 'Platinum').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4"
            />
          </div>

          {/* Customer List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => {
              const nextTier = getNextTier(customer);
              const progressToNext = nextTier 
                ? ((customer.points - loyaltyProgram.tiers.find(t => t.name === customer.tier)!.minPoints) / 
                   (nextTier.minPoints - loyaltyProgram.tiers.find(t => t.name === customer.tier)!.minPoints)) * 100
                : 100;

              return (
                <Card key={customer.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <Badge className={`${getTierColor(customer.tier)} text-white`}>
                        {customer.tier}
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Points</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {customer.points.toLocaleString()}
                      </span>
                    </div>
                    
                    {nextTier && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress to {nextTier.name}</span>
                          <span>{Math.round(progressToNext)}%</span>
                        </div>
                        <Progress value={progressToNext} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {nextTier.minPoints - customer.points} points to {nextTier.name}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Spent</span>
                        <div className="font-medium">${customer.totalSpent}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Visits</span>
                        <div className="font-medium">{customer.visits}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addPoints(customer.id, 100)}
                      >
                        +100 pts
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="program" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Structure</CardTitle>
              <CardDescription>
                Current tier system and benefits for {loyaltyProgram.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Points System</h3>
                  <p className="text-sm text-gray-600">
                    Customers earn {loyaltyProgram.pointsPerDollar} points for every $1 spent
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Tier Benefits</h3>
                  {loyaltyProgram.tiers.map((tier, index) => (
                    <div key={tier.name} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-4 h-4 rounded-full ${tier.color}`} />
                        <h4 className="font-medium">{tier.name} Tier</h4>
                        <Badge variant="outline">
                          {tier.minPoints}+ points
                        </Badge>
                      </div>
                      <ul className="space-y-1">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <Star className="h-3 w-3 mr-2 text-yellow-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Rewards</CardTitle>
              <CardDescription>
                Rewards customers can redeem with their points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Free Appetizer', points: 250, description: 'Any appetizer from our menu' },
                  { name: '10% Off Meal', points: 500, description: 'Discount on your entire order' },
                  { name: 'Free Dessert', points: 200, description: 'Choose any dessert' },
                  { name: 'Free Beverage', points: 150, description: 'Any soft drink or coffee' },
                  { name: 'Free Entree', points: 750, description: 'Any main course item' },
                  { name: '20% Off Meal', points: 1000, description: 'Bigger discount for loyal customers' }
                ].map((reward, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{reward.name}</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {reward.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Customer Modal */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your loyalty program.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddCustomerOpen(false)}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerLoyalty;
