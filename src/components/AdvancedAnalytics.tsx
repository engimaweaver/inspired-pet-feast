import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Star, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AnalyticsCard from './shared/AnalyticsCard';
import ChartWrapper from './shared/ChartWrapper';
import DataTable from './shared/DataTable';

const revenueData = [
  { name: 'Mon', revenue: 4200, orders: 42, customers: 38 },
  { name: 'Tue', revenue: 3800, orders: 38, customers: 35 },
  { name: 'Wed', revenue: 5200, orders: 52, customers: 48 },
  { name: 'Thu', revenue: 4800, orders: 48, customers: 44 },
  { name: 'Fri', revenue: 6200, orders: 62, customers: 58 },
  { name: 'Sat', revenue: 7800, orders: 78, customers: 72 },
  { name: 'Sun', revenue: 6800, orders: 68, customers: 63 }
];

const hourlyData = [
  { hour: '11:00', orders: 8, revenue: 320 },
  { hour: '12:00', orders: 15, revenue: 750 },
  { hour: '13:00', orders: 22, revenue: 1100 },
  { hour: '14:00', orders: 18, revenue: 900 },
  { hour: '15:00', orders: 12, revenue: 480 },
  { hour: '16:00', orders: 8, revenue: 320 },
  { hour: '17:00', orders: 14, revenue: 560 },
  { hour: '18:00', orders: 25, revenue: 1250 },
  { hour: '19:00', orders: 30, revenue: 1500 },
  { hour: '20:00', orders: 28, revenue: 1400 },
  { hour: '21:00', orders: 20, revenue: 800 },
  { hour: '22:00', orders: 12, revenue: 480 }
];

const menuItemsData = [
  { name: 'Caesar Salad', orders: 156, revenue: 2340, percentage: 18 },
  { name: 'Grilled Salmon', orders: 134, revenue: 2680, percentage: 15 },
  { name: 'Margherita Pizza', orders: 128, revenue: 1920, percentage: 14 },
  { name: 'Beef Burger', orders: 112, revenue: 1680, percentage: 13 },
  { name: 'Chicken Wings', orders: 98, revenue: 1176, percentage: 11 },
  { name: 'Pasta Carbonara', orders: 89, revenue: 1335, percentage: 10 },
  { name: 'Others', orders: 183, revenue: 2869, percentage: 19 }
];

const customerAnalytics = [
  { segment: 'New Customers', count: 145, percentage: 35, growth: 12 },
  { segment: 'Returning Customers', count: 198, percentage: 48, growth: 8 },
  { segment: 'VIP Customers', count: 42, percentage: 10, growth: 15 },
  { segment: 'Inactive Customers', count: 28, percentage: 7, growth: -5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const AdvancedAnalytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedStore, setSelectedStore] = useState('all');

  const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = revenueData.reduce((sum, day) => sum + day.orders, 0);
  const averageOrderValue = totalRevenue / totalOrders;
  const weeklyGrowth = 12.5;

  const keyMetrics = [
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: `+${weeklyGrowth}% from last week`, trend: 'up' as const, icon: DollarSign },
    { title: 'Total Orders', value: totalOrders.toString(), change: '+8.2% from last week', trend: 'up' as const, icon: Users },
    { title: 'Avg Order Value', value: `$${averageOrderValue.toFixed(2)}`, change: '+3.1% from last week', trend: 'up' as const, icon: TrendingUp },
    { title: 'Customer Satisfaction', value: '4.8', change: '+0.2 from last week', trend: 'up' as const, icon: Star }
  ];

  const menuColumns = [
    { key: 'name', header: 'Item Name' },
    { key: 'orders', header: 'Orders' },
    { key: 'revenue', header: 'Revenue', render: (value: number) => `$${value}` },
    { key: 'percentage', header: 'Share', render: (value: number) => `${value}%` }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Deep insights into your restaurant performance</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="downtown">Downtown Cafe</SelectItem>
              <SelectItem value="mall">Mall Location</SelectItem>
              <SelectItem value="airport">Airport Branch</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <AnalyticsCard key={index} {...metric} />
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="menu">Menu Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWrapper title="Daily Revenue Trend" description="Revenue and order volume over the past week">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value}` : value,
                  name === 'revenue' ? 'Revenue' : 'Orders'
                ]} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ChartWrapper>

            <ChartWrapper title="Hourly Performance" description="Orders and revenue by hour of day">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ChartWrapper>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataTable
              title="Top Menu Items"
              description="Best performing items by order count and revenue"
              columns={menuColumns}
              data={menuItemsData.slice(0, 6)}
            />

            <ChartWrapper title="Menu Item Distribution" description="Order distribution across menu categories">
              <PieChart>
                <Pie
                  data={menuItemsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="orders"
                >
                  {menuItemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartWrapper>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Segments</h3>
              {customerAnalytics.map((segment) => (
                <AnalyticsCard
                  key={segment.segment}
                  title={segment.segment}
                  value={segment.count}
                  change={`${segment.percentage}% of total`}
                  trend={segment.growth > 0 ? 'up' : segment.growth < 0 ? 'down' : 'neutral'}
                  badge={{ text: `${segment.growth > 0 ? '+' : ''}${segment.growth}%`, variant: segment.growth > 0 ? 'default' : 'destructive' }}
                />
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Customer Behavior</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Average Visit Frequency</span>
                    <span className="text-sm">2.3 times/month</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Customer Retention Rate</span>
                    <span className="text-sm">68%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Loyalty Program Adoption</span>
                    <span className="text-sm">45%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Metrics</h3>
              <AnalyticsCard title="Average Prep Time" value="18 min" icon={Clock} />
              <AnalyticsCard title="Table Turnover Rate" value="2.4x" icon={Users} />
              <AnalyticsCard title="Order Accuracy" value="96%" icon={Star} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Peak Hours Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Lunch Rush</h4>
                  <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded">
                    12:00 PM - 2:00 PM • 85% capacity
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Dinner Rush</h4>
                  <div className="bg-red-100 text-red-800 px-3 py-2 rounded">
                    6:00 PM - 8:00 PM • 95% capacity
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Weekend Peak</h4>
                  <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded">
                    Saturday 7:00 PM - 9:00 PM • 100% capacity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
