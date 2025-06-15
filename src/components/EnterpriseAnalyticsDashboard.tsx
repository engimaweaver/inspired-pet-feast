
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target, AlertTriangle, CheckCircle, Clock, Star } from 'lucide-react';

// Advanced analytics data
const revenueAnalytics = [
  { month: 'Jan', revenue: 145000, profit: 32000, customers: 1250, orders: 2100, avgOrder: 69 },
  { month: 'Feb', revenue: 162000, profit: 38000, customers: 1380, orders: 2340, avgOrder: 69 },
  { month: 'Mar', revenue: 158000, profit: 36000, customers: 1420, orders: 2280, avgOrder: 69 },
  { month: 'Apr', revenue: 181000, profit: 45000, customers: 1580, orders: 2620, avgOrder: 69 },
  { month: 'May', revenue: 175000, profit: 42000, customers: 1650, orders: 2540, avgOrder: 69 },
  { month: 'Jun', revenue: 197000, profit: 52000, customers: 1820, orders: 2860, avgOrder: 69 },
];

const customerSegmentation = [
  { segment: 'VIP Customers', value: 15, revenue: 45, color: '#8b5cf6' },
  { segment: 'Loyal Customers', value: 35, revenue: 40, color: '#3b82f6' },
  { segment: 'Regular Customers', value: 40, revenue: 12, color: '#10b981' },
  { segment: 'New Customers', value: 10, revenue: 3, color: '#f59e0b' },
];

const predictiveMetrics = [
  { metric: 'Revenue Forecast (Next Month)', value: '$215,000', confidence: '94%', trend: 'up' },
  { metric: 'Customer Churn Risk', value: '3.2%', confidence: '89%', trend: 'down' },
  { metric: 'Inventory Optimization', value: '18%', confidence: '92%', trend: 'up' },
  { metric: 'Peak Hour Prediction', value: '7-9 PM', confidence: '96%', trend: 'neutral' },
];

const complianceMetrics = [
  { area: 'Data Privacy (GDPR)', status: 'compliant', score: 98, lastAudit: '2024-01-15' },
  { area: 'PCI DSS Compliance', status: 'compliant', score: 96, lastAudit: '2024-01-10' },
  { area: 'Food Safety Standards', status: 'compliant', score: 100, lastAudit: '2024-01-20' },
  { area: 'Financial Reporting', status: 'compliant', score: 99, lastAudit: '2024-01-18' },
];

const performanceMetrics = [
  { metric: 'Average Response Time', value: '1.2s', target: '< 2s', status: 'good' },
  { metric: 'System Uptime', value: '99.98%', target: '> 99.9%', status: 'excellent' },
  { metric: 'Order Processing Speed', value: '45s', target: '< 60s', status: 'good' },
  { metric: 'Cache Hit Rate', value: '94.5%', target: '> 90%', status: 'excellent' },
];

const EnterpriseAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedStore, setSelectedStore] = useState('all');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Analytics Dashboard</h1>
          <p className="text-gray-600">Advanced business intelligence and predictive analytics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="downtown">Downtown Location</SelectItem>
              <SelectItem value="mall">Mall Location</SelectItem>
              <SelectItem value="airport">Airport Location</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,118,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.5% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,100</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.3% new customers
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Volume</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,740</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.2% vs target
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.8%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% optimization
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Profit Trends</CardTitle>
                <CardDescription>6-month financial performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer & Order Analytics</CardTitle>
                <CardDescription>Customer growth and order volume trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
                <CardDescription>Customer distribution and revenue contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegmentation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, value }) => `${segment}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerSegmentation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
                <CardDescription>Detailed customer analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegmentation.map((segment) => (
                    <div key={segment.segment} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <div>
                          <p className="font-medium">{segment.segment}</p>
                          <p className="text-sm text-gray-600">{segment.value}% of customers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{segment.revenue}%</p>
                        <p className="text-sm text-gray-600">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Predictive Analytics</CardTitle>
              <CardDescription>Machine learning insights and forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {predictiveMetrics.map((metric) => (
                  <div key={metric.metric} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{metric.metric}</h4>
                      <Badge variant={metric.trend === 'up' ? 'default' : metric.trend === 'down' ? 'destructive' : 'secondary'}>
                        {metric.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {metric.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                        {metric.confidence}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-sm text-gray-600">Confidence: {metric.confidence}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Metrics</CardTitle>
              <CardDescription>Real-time system health and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.metric} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{metric.metric}</h4>
                      <p className="text-sm text-gray-600">Target: {metric.target}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold">{metric.value}</span>
                      <Badge variant={metric.status === 'excellent' ? 'default' : 'secondary'}>
                        {metric.status === 'excellent' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {metric.status === 'good' && <Clock className="h-3 w-3 mr-1" />}
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Audit Status</CardTitle>
              <CardDescription>Regulatory compliance and audit trail</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceMetrics.map((item) => (
                  <div key={item.area} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.area}</h4>
                      <p className="text-sm text-gray-600">Last Audit: {item.lastAudit}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold">{item.score}%</span>
                      <Badge variant={item.status === 'compliant' ? 'default' : 'destructive'}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">47</div>
                <p className="text-sm text-gray-600">Active orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Current Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$3,247</div>
                <p className="text-sm text-gray-600">Today so far</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Kitchen Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">78%</div>
                <p className="text-sm text-gray-600">Capacity utilized</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseAnalyticsDashboard;
