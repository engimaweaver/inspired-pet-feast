
import React from 'react';
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';

interface MetricsData {
  revenue?: { value: string; change: string; trend: 'up' | 'down' | 'neutral' };
  orders?: { value: string; change: string; trend: 'up' | 'down' | 'neutral' };
  customers?: { value: string; change: string; trend: 'up' | 'down' | 'neutral' };
  rating?: { value: string; change: string; trend: 'up' | 'down' | 'neutral' };
}

interface MetricsDashboardProps {
  data: MetricsData;
  className?: string;
}

const MetricsDashboard = ({ data, className }: MetricsDashboardProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {data.revenue && (
        <AnalyticsCard
          title="Revenue"
          value={data.revenue.value}
          change={data.revenue.change}
          trend={data.revenue.trend}
          icon={DollarSign}
        />
      )}
      {data.orders && (
        <AnalyticsCard
          title="Orders"
          value={data.orders.value}
          change={data.orders.change}
          trend={data.orders.trend}
          icon={ShoppingCart}
        />
      )}
      {data.customers && (
        <AnalyticsCard
          title="Customers"
          value={data.customers.value}
          change={data.customers.change}
          trend={data.customers.trend}
          icon={Users}
        />
      )}
      {data.rating && (
        <AnalyticsCard
          title="Rating"
          value={data.rating.value}
          change={data.rating.change}
          trend={data.rating.trend}
          icon={TrendingUp}
        />
      )}
    </div>
  );
};

export default MetricsDashboard;
