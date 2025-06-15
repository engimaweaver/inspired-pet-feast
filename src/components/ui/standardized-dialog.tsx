
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';

interface StandardizedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  hideCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const StandardizedDialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  loading = false,
  hideCloseButton = false,
}: StandardizedDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[size]} ${loading ? 'pointer-events-none' : ''}`}>
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </div>
            {!hideCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="py-4">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
