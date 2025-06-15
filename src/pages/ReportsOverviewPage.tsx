
import React, { useState } from 'react';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { ActionButtonGroup } from '@/components/ui/action-button-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Calendar, Download, Filter } from 'lucide-react';

const ReportsOverviewPage = () => {
  const [dateRange, setDateRange] = useState('today');
  const [reportType, setReportType] = useState('sales');

  const salesData = [
    { name: 'Mon', sales: 12000, orders: 45 },
    { name: 'Tue', sales: 15000, orders: 52 },
    { name: 'Wed', sales: 18000, orders: 63 },
    { name: 'Thu', sales: 14000, orders: 48 },
    { name: 'Fri', sales: 22000, orders: 78 },
    { name: 'Sat', sales: 28000, orders: 92 },
    { name: 'Sun', sales: 25000, orders: 85 }
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '₹1,24,000',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: 'Total Orders',
      value: '463',
      change: '+8.2%',
      trend: 'up',
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      title: 'Customers Served',
      value: '1,247',
      change: '+15.3%',
      trend: 'up',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Avg Order Value',
      value: '₹268',
      change: '-2.1%',
      trend: 'down',
      icon: <Calendar className="h-5 w-5" />
    }
  ];

  const topItems = [
    { name: 'Chicken Biryani', sales: 156, revenue: '₹39,000' },
    { name: 'Paneer Butter Masala', sales: 134, revenue: '₹24,120' },
    { name: 'Dal Makhani', sales: 98, revenue: '₹14,700' },
    { name: 'Naan', sales: 234, revenue: '₹11,700' }
  ];

  const exportButtons = [
    {
      label: 'Export PDF',
      onClick: () => console.log('Export PDF'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const
    },
    {
      label: 'Export Excel',
      onClick: () => console.log('Export Excel'),
      icon: <Download className="h-4 w-4" />,
      variant: 'outline' as const
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Reports Overview</h1>
            <p className="text-gray-600">Comprehensive business analytics and reports</p>
          </div>
        </div>
        <ActionButtonGroup buttons={exportButtons} />
      </div>

      <div className="flex items-center gap-4">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales Report</SelectItem>
            <SelectItem value="inventory">Inventory Report</SelectItem>
            <SelectItem value="staff">Staff Report</SelectItem>
            <SelectItem value="customer">Customer Report</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <StandardizedCard key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                <div className={`flex items-center gap-1 mt-1 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    <TrendingDown className="h-3 w-3" />
                  }
                  <span className="text-sm">{metric.change}</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {metric.icon}
              </div>
            </div>
          </StandardizedCard>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StandardizedCard title="Sales Trend" size="lg">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </StandardizedCard>

            <StandardizedCard title="Top Performing Items" size="lg">
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.sales} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.revenue}</p>
                      <div className="w-20 mt-1">
                        <Progress value={(item.sales / 250) * 100} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StandardizedCard>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <StandardizedCard title="Detailed Sales Analysis" size="lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3">Payment Methods</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cash</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-sm">Card</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  <div className="flex justify-between">
                    <span className="text-sm">UPI</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Peak Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">12:00 - 14:00</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">19:00 - 21:00</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">21:00 - 23:00</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Order Types</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Dine-in</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Takeaway</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Delivery</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </StandardizedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsOverviewPage;
