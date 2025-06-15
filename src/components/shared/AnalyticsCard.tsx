
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AnalyticsCardProps {
  title: string;
  description?: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  className?: string;
}

const AnalyticsCard = ({ 
  title, 
  description, 
  value, 
  change, 
  trend = 'neutral', 
  icon: Icon,
  badge,
  className 
}: AnalyticsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="mt-1">{description}</CardDescription>
        )}
        {change && (
          <p className={`text-xs mt-1 ${getTrendColor()}`}>
            {change}
          </p>
        )}
        {badge && (
          <Badge variant={badge.variant || 'default'} className="mt-2">
            {badge.text}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
