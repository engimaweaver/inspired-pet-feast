
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import OrdersTable from './OrdersTable';
import MetricsDashboard from './shared/MetricsDashboard';
import ChartWrapper from './shared/ChartWrapper';
import { DASHBOARD_METRICS, WEEKLY_CHART_DATA } from '@/constants/dashboardData';
import { 
  getDefaultCartesianGrid, 
  getDefaultAxis, 
  getBarChartConfig, 
  getLineChartConfig 
} from '@/utils/chartUtils';

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

      <MetricsDashboard data={DASHBOARD_METRICS} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Weekly Orders">
          <BarChart data={WEEKLY_CHART_DATA}>
            <CartesianGrid {...getDefaultCartesianGrid()} />
            <XAxis dataKey="day" {...getDefaultAxis()} />
            <YAxis {...getDefaultAxis()} />
            <Bar {...getBarChartConfig('orders')} />
          </BarChart>
        </ChartWrapper>

        <ChartWrapper title="Revenue Trend">
          <LineChart data={WEEKLY_CHART_DATA}>
            <CartesianGrid {...getDefaultCartesianGrid()} />
            <XAxis dataKey="day" {...getDefaultAxis()} />
            <YAxis {...getDefaultAxis()} />
            <Line {...getLineChartConfig('revenue')} />
          </LineChart>
        </ChartWrapper>
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
