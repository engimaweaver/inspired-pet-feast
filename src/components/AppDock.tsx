
import { useState } from 'react';
import { 
  BarChart3, 
  Receipt, 
  ChefHat, 
  Package, 
  Calendar, 
  Globe, 
  Monitor, 
  Users, 
  TrendingUp,
  Crown,
  Heart,
  Sparkles,
  Map,
  DollarSign,
  Calculator,
  MessageSquare,
  Star,
  PieChart,
  Shield,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';

interface AppIcon {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  premium?: string;
  gradient?: string;
}

interface AppDockProps {
  onAppSelect: (appId: string) => void;
  activeApp: string;
}

const apps: AppIcon[] = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: BarChart3, 
    color: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600'
  },
  { 
    id: 'billing', 
    label: 'Billing', 
    icon: Receipt, 
    color: 'bg-green-500',
    gradient: 'from-green-400 to-green-600'
  },
  { 
    id: 'menu', 
    label: 'Menu', 
    icon: ChefHat, 
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600'
  },
  { 
    id: 'inventory', 
    label: 'Inventory', 
    icon: Package, 
    color: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600'
  },
  { 
    id: 'reservations', 
    label: 'Reservations', 
    icon: Calendar, 
    color: 'bg-red-500',
    gradient: 'from-red-400 to-red-600'
  },
  { 
    id: 'online-orders', 
    label: 'Online Orders', 
    icon: Globe, 
    color: 'bg-cyan-500',
    gradient: 'from-cyan-400 to-cyan-600'
  },
  { 
    id: 'kitchen', 
    label: 'Kitchen', 
    icon: Monitor, 
    color: 'bg-yellow-500',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  { 
    id: 'staff', 
    label: 'Staff', 
    icon: Users, 
    color: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: TrendingUp, 
    color: 'bg-pink-500',
    gradient: 'from-pink-400 to-pink-600'
  },
  { 
    id: 'multi-store', 
    label: 'Multi-Store', 
    icon: Crown, 
    color: 'bg-violet-500',
    gradient: 'from-violet-400 to-violet-600',
    premium: 'multi-store'
  },
  { 
    id: 'loyalty', 
    label: 'Loyalty', 
    icon: Heart, 
    color: 'bg-rose-500',
    gradient: 'from-rose-400 to-rose-600',
    premium: 'customer-loyalty'
  },
  { 
    id: 'ai-recommendations', 
    label: 'AI Insights', 
    icon: Sparkles, 
    color: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-emerald-600',
    premium: 'ai-recommendations'
  },
  { 
    id: 'floor-plan', 
    label: 'Floor Plan', 
    icon: Map, 
    color: 'bg-teal-500',
    gradient: 'from-teal-400 to-teal-600'
  },
  { 
    id: 'financial-analytics', 
    label: 'Finance', 
    icon: DollarSign, 
    color: 'bg-lime-500',
    gradient: 'from-lime-400 to-lime-600',
    premium: 'financial-analytics'
  },
  { 
    id: 'cost-management', 
    label: 'Costs', 
    icon: Calculator, 
    color: 'bg-amber-500',
    gradient: 'from-amber-400 to-amber-600',
    premium: 'cost-management'
  },
  { 
    id: 'customer-feedback', 
    label: 'Feedback', 
    icon: MessageSquare, 
    color: 'bg-sky-500',
    gradient: 'from-sky-400 to-sky-600',
    premium: 'customer-feedback'
  },
  { 
    id: 'review-management', 
    label: 'Reviews', 
    icon: Star, 
    color: 'bg-orange-600',
    gradient: 'from-orange-500 to-orange-700',
    premium: 'review-management'
  },
  { 
    id: 'enterprise-analytics', 
    label: 'Enterprise', 
    icon: PieChart, 
    color: 'bg-slate-600',
    gradient: 'from-slate-500 to-slate-700',
    premium: 'advanced-reporting'
  },
  { 
    id: 'system-monitoring', 
    label: 'Monitoring', 
    icon: Shield, 
    color: 'bg-gray-600',
    gradient: 'from-gray-500 to-gray-700'
  },
  { 
    id: 'compliance', 
    label: 'Compliance', 
    icon: FileText, 
    color: 'bg-stone-600',
    gradient: 'from-stone-500 to-stone-700'
  }
];

const AppDock = ({ onAppSelect, activeApp }: AppDockProps) => {
  const { isFeatureEnabled } = usePremiumFeatures();
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const handleAppClick = (app: AppIcon) => {
    if (app.premium && !isFeatureEnabled(app.premium)) {
      // Could trigger upgrade modal here
      return;
    }
    onAppSelect(app.id);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-3 shadow-2xl">
        <div className="flex items-center space-x-2">
          {apps.map((app) => {
            const Icon = app.icon;
            const isActive = activeApp === app.id;
            const isHovered = hoveredApp === app.id;
            const isPremium = app.premium && !isFeatureEnabled(app.premium);
            
            return (
              <div key={app.id} className="relative">
                <Button
                  variant="ghost"
                  size="lg"
                  className={`
                    relative p-3 h-14 w-14 rounded-xl transition-all duration-200 hover:scale-110
                    ${isActive ? 'scale-110 shadow-lg' : ''}
                    ${isPremium ? 'opacity-60' : ''}
                  `}
                  onClick={() => handleAppClick(app)}
                  onMouseEnter={() => setHoveredApp(app.id)}
                  onMouseLeave={() => setHoveredApp(null)}
                >
                  <div className={`
                    absolute inset-0 rounded-xl bg-gradient-to-br ${app.gradient || app.color}
                    ${isActive ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                  `} />
                  <Icon className="h-6 w-6 text-white relative z-10" />
                  {isPremium && (
                    <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 z-20" />
                  )}
                </Button>
                
                {(isHovered || isActive) && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {app.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppDock;
