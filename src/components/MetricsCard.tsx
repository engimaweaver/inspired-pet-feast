
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
}

const MetricsCard = ({ title, value, change, icon: Icon, trend }: MetricsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getIconBgColor = () => {
    switch (trend) {
      case 'up':
        return 'bg-green-100';
      case 'down':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getIconColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 ${getTrendColor()}`}>{change}</p>
        </div>
        <div className={`p-3 rounded-lg ${getIconBgColor()}`}>
          <Icon className={`h-6 w-6 ${getIconColor()}`} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
