
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer } from 'recharts';

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactElement;
  height?: number;
  className?: string;
}

const ChartWrapper = ({ 
  title, 
  description, 
  children, 
  height = 300,
  className 
}: ChartWrapperProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
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
