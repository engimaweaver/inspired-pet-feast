
import { X, Minus, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppWindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  fullscreen?: boolean;
}

const AppWindow = ({ title, children, onClose, fullscreen = true }: AppWindowProps) => {
  return (
    <div className={`
      bg-white rounded-t-2xl shadow-2xl border border-gray-200/50 
      ${fullscreen 
        ? 'fixed inset-x-6 top-6 bottom-24' 
        : 'w-full h-full max-w-4xl mx-auto mt-6 mb-24'
      }
      flex flex-col overflow-hidden
    `}>
      {/* Window Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Square className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Window Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AppWindow;
