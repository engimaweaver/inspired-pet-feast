
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

interface ActionButtonGroupProps {
  buttons: ActionButton[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ActionButtonGroup = ({
  buttons,
  orientation = 'horizontal',
  size = 'md',
  className = '',
}: ActionButtonGroupProps) => {
  const orientationClasses = orientation === 'horizontal' ? 'flex gap-2' : 'flex flex-col gap-2';
  
  // Map ActionButtonGroup sizes to Button component sizes
  const getButtonSize = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'sm';
      case 'md':
        return 'default';
      case 'lg':
        return 'lg';
      default:
        return 'default';
    }
  };

  return (
    <div className={`${orientationClasses} ${className}`}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant={button.variant || 'default'}
          size={getButtonSize(size)}
          onClick={button.onClick}
          disabled={button.disabled || button.loading}
          className="flex items-center gap-2"
        >
          {button.loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            button.icon
          )}
          {button.label}
        </Button>
      ))}
    </div>
  );
};
