
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Package, DollarSign, Calculator, Target } from 'lucide-react';

const costTrendData = [
  { week: 'W1', foodCost: 2800, target: 2500, variance: 12 },
  { week: 'W2', foodCost: 2650, target: 2500, variance: 6 },
  { week: 'W3', foodCost: 2900, target: 2500, variance: 16 },
  { week: 'W4', foodCost: 2550, target: 2500, variance: 2 },
];

const inventoryItems = [
  { item: 'Premium Beef', currentStock: 45, reorderPoint: 50, cost: 12.50, usage: 85, status: 'low' },
  { item: 'Fresh Salmon', currentStock: 25, reorderPoint: 30, cost: 18.00, usage: 70, status: 'low' },
  { item: 'Organic Lettuce', currentStock: 120, reorderPoint: 80, cost: 2.50, usage: 60, status: 'good' },
  { item: 'Tomatoes', currentStock: 95, reorderPoint: 100, cost: 3.25, usage: 90, status: 'critical' },
  { item: 'Cheese Blend', currentStock: 35, reorderPoint: 40, cost: 8.75, usage: 75, status: 'low' },
];

const supplierComparison = [
  { supplier: 'FreshFarm Co.', item: 'Organic Vegetables', currentPrice: 2.50, competitorPrice: 2.75, savings: 10 },
  { supplier: 'Ocean Fresh', item: 'Atlantic Salmon', currentPrice: 18.00, competitorPrice: 16.50, savings: -8.3 },
  { supplier: 'Local Butcher', item: 'Premium Beef', currentPrice: 12.50, competitorPrice: 13.20, savings: 5.6 },
  { supplier: 'Dairy Direct', item: 'Cheese Products', currentPrice: 8.75, competitorPrice: 9.00, savings: 2.8 },
];

const wasteData = [
  { category: 'Expired Produce', amount: 125, cost: 312.50 },
  { category: 'Over-preparation', amount: 85, cost: 425.00 },
  { category: 'Customer Returns', amount: 15, cost: 78.75 },
  { category: 'Kitchen Errors', amount: 35, cost: 147.50 },
];

const CostManagement = () => {
  const totalWasteCost = wasteData.reduce((sum, item) => sum + item.cost, 0);
  const currentFoodCostPercentage = 28.5;
  const targetFoodCostPercentage = 25.0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cost Management</h1>
          <p className="text-gray-600">Food cost tracking and optimization</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Recipe Calculator
          </Button>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            Set Targets
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Cost %</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentFoodCostPercentage}%</div>
            <Progress value={(currentFoodCostPercentage / 35) * 100} className="mt-2" />
            <div className="text-xs text-red-600 mt-1">
              {(currentFoodCostPercentage - targetFoodCostPercentage).toFixed(1)}% above target
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Food Cost</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,550</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -12% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Cost</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWasteCost.toFixed(2)}</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supplier Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$485</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Monthly potential
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Food cost percentage is 3.5% above target. Consider reviewing portion sizes and supplier contracts.
          </AlertDescription>
        </Alert>
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            3 items are below reorder point. Check inventory levels and place orders soon.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Cost Trends</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Tracking</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Analysis</TabsTrigger>
          <TabsTrigger value="waste">Waste Management</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Food Cost Trends</CardTitle>
              <CardDescription>Weekly food cost vs target analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-80">
                <LineChart data={costTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="foodCost" stroke="#ef4444" strokeWidth={2} name="Actual Cost" />
                  <Line type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current stock levels and reorder alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryItems.map((item) => (
                  <div key={item.item} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.item}</h3>
                        <Badge variant={
                          item.status === 'critical' ? 'destructive' : 
                          item.status === 'low' ? 'secondary' : 'default'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ${item.cost} per unit | Usage: {item.usage}% this week
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.currentStock} units</div>
                      <div className="text-sm text-gray-600">
                        Reorder at: {item.reorderPoint}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Price Comparison</CardTitle>
              <CardDescription>Compare current suppliers with market alternatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierComparison.map((supplier) => (
                  <div key={`${supplier.supplier}-${supplier.item}`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{supplier.supplier}</h3>
                      <p className="text-sm text-gray-600">{supplier.item}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm">Current: ${supplier.currentPrice}</div>
                        <div className="text-sm">Market: ${supplier.competitorPrice}</div>
                      </div>
                      <Badge variant={supplier.savings > 0 ? "default" : "destructive"}>
                        {supplier.savings > 0 ? '+' : ''}{supplier.savings.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waste" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Waste Analysis</CardTitle>
              <CardDescription>Weekly waste breakdown and cost impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wasteData.map((waste) => (
                  <div key={waste.category} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-red-900">{waste.category}</h3>
                      <p className="text-sm text-red-700">{waste.amount} items wasted</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-900">${waste.cost.toFixed(2)}</div>
                      <div className="text-sm text-red-700">Cost impact</div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Weekly Waste Cost:</span>
                    <span className="text-xl font-bold text-red-600">${totalWasteCost.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Represents {((totalWasteCost / 10000) * 100).toFixed(1)}% of weekly revenue
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CostManagement;
