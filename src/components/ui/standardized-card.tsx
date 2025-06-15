
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface StandardizedCardProps {
  title?: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children: React.ReactNode;
  action?: React.ReactNode;
  loading?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const StandardizedCard = ({
  title,
  subtitle,
  badge,
  children,
  action,
  loading = false,
  className = '',
  size = 'md',
}: StandardizedCardProps) => {
  return (
    <Card className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {(title || subtitle || badge || action) && (
        <CardHeader className={`${sizeClasses[size]} pb-2`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  {title}
                  {badge && (
                    <Badge variant={badge.variant || 'default'} className="text-xs">
                      {badge.text}
                    </Badge>
                  )}
                </CardTitle>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </CardHeader>
      )}

      <CardContent className={sizeClasses[size]}>
        {children}
      </CardContent>
    </Card>
  );
};
