
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Store, Users, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import MetricsCard from './MetricsCard';
import StoreSelector from './StoreSelector';

interface Store {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
}

// Mock data for multi-store analytics
const storePerformanceData = [
  { store: 'Downtown', revenue: 12400, orders: 156, growth: 12.5 },
  { store: 'Mall', revenue: 9800, orders: 134, growth: 8.2 },
  { store: 'Airport', revenue: 15600, orders: 189, growth: 15.3 },
  { store: 'Campus', revenue: 6200, orders: 89, growth: -2.1 },
];

const weeklyTrends = [
  { day: 'Mon', downtown: 2400, mall: 1800, airport: 2800, campus: 1200 },
  { day: 'Tue', downtown: 2800, mall: 2200, airport: 3200, campus: 1400 },
  { day: 'Wed', downtown: 2200, mall: 1900, airport: 2900, campus: 1100 },
  { day: 'Thu', downtown: 3200, mall: 2600, airport: 3800, campus: 1600 },
  { day: 'Fri', downtown: 4100, mall: 3400, airport: 4200, campus: 2100 },
  { day: 'Sat', downtown: 4800, mall: 4100, airport: 4900, campus: 2800 },
  { day: 'Sun', downtown: 3600, mall: 3200, airport: 4100, campus: 2200 },
];

const categoryDistribution = [
  { name: 'Food', value: 65, color: '#3b82f6' },
  { name: 'Beverages', value: 25, color: '#10b981' },
  { name: 'Desserts', value: 10, color: '#f59e0b' },
];

const MultiStoreAnalytics = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>({
    id: 'all',
    name: 'All Stores',
    location: 'Chain-wide view',
    status: 'active'
  });

  const totalRevenue = storePerformanceData.reduce((sum, store) => sum + store.revenue, 0);
  const totalOrders = storePerformanceData.reduce((sum, store) => sum + store.orders, 0);
  const avgGrowth = storePerformanceData.reduce((sum, store) => sum + store.growth, 0) / storePerformanceData.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-Store Analytics</h1>
          <p className="text-gray-600 mt-1">Performance overview across all locations</p>
        </div>
        <StoreSelector
          selectedStore={selectedStore}
          onStoreSelect={setSelectedStore}
          showAllStores={true}
        />
      </div>

      {/* Chain-wide Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={`${avgGrowth > 0 ? '+' : ''}${avgGrowth.toFixed(1)}%`}
          icon={DollarSign}
          trend={avgGrowth > 0 ? 'up' : 'down'}
        />
        <MetricsCard
          title="Total Orders"
          value={totalOrders.toString()}
          change="+8.2% vs last week"
          icon={Users}
          trend="up"
        />
        <MetricsCard
          title="Active Stores"
          value={`${storePerformanceData.length}/4`}
          change="All operational"
          icon={Store}
          trend="neutral"
        />
        <MetricsCard
          title="Avg. Growth Rate"
          value={`${avgGrowth.toFixed(1)}%`}
          change="Chain performance"
          icon={TrendingUp}
          trend={avgGrowth > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Store Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Store</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Growth</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {storePerformanceData.map((store, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{store.store}</td>
                  <td className="py-3 px-4 text-gray-700">${store.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{store.orders}</td>
                  <td className="py-3 px-4">
                    <div className={`flex items-center space-x-1 ${
                      store.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {store.growth > 0 ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      )}
                      <span>{store.growth > 0 ? '+' : ''}{store.growth}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Line type="monotone" dataKey="downtown" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="mall" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="airport" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="campus" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStoreAnalytics;
