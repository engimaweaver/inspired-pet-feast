
import MetricsCard from './MetricsCard';
import OrdersTable from './OrdersTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', orders: 45, revenue: 2400 },
  { day: 'Tue', orders: 52, revenue: 2800 },
  { day: 'Wed', orders: 38, revenue: 2200 },
  { day: 'Thu', orders: 61, revenue: 3200 },
  { day: 'Fri', orders: 78, revenue: 4100 },
  { day: 'Sat', orders: 89, revenue: 4800 },
  { day: 'Sun', orders: 67, revenue: 3600 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening at your restaurant today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Today's Revenue"
          value="$4,280"
          change="+12.5%"
          icon={DollarSign}
          trend="up"
        />
        <MetricsCard
          title="Orders Today"
          value="89"
          change="+8.2%"
          icon={ShoppingCart}
          trend="up"
        />
        <MetricsCard
          title="Active Tables"
          value="24/32"
          change="75% occupied"
          icon={Users}
          trend="neutral"
        />
        <MetricsCard
          title="Customer Rating"
          value="4.8"
          change="+0.2 this week"
          icon={TrendingUp}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Orders</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-600 mt-1">Latest orders from your restaurant</p>
        </div>
        <OrdersTable />
      </div>
    </div>
  );
};

export default Dashboard;
