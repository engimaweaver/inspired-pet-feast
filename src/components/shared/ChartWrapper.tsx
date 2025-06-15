
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer } from 'recharts';

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactElement;
  height?: number;
  className?: string;
  headerAction?: React.ReactNode;
}

const ChartWrapper = ({ 
  title, 
  description, 
  children, 
  height = 300,
  className,
  headerAction
}: ChartWrapperProps) => {
  return (
    <Card className={className}>
      <CardHeader className={headerAction ? "flex flex-row items-center justify-between" : ""}>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {headerAction}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartWrapper;
