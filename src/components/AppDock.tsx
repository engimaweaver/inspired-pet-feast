
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
  FileText,
  ChevronRight,
  Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';

interface AppIcon {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  premium?: string;
  gradient?: string;
  category: string;
  bgPattern?: string;
}

interface AppCategory {
  id: string;
  name: string;
  color: string;
  apps: AppIcon[];
}

interface AppDockProps {
  onAppSelect: (appId: string) => void;
  activeApp: string;
}

const apps: AppIcon[] = [
  // Core Operations
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: BarChart3, 
    color: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    category: 'core',
    bgPattern: 'dots'
  },
  { 
    id: 'billing', 
    label: 'Billing', 
    icon: Receipt, 
    color: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-emerald-600',
    category: 'core',
    bgPattern: 'grid'
  },
  { 
    id: 'menu', 
    label: 'Menu', 
    icon: ChefHat, 
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
    category: 'core',
    bgPattern: 'waves'
  },
  { 
    id: 'kitchen', 
    label: 'Kitchen', 
    icon: Monitor, 
    color: 'bg-red-500',
    gradient: 'from-red-400 to-red-600',
    category: 'core',
    bgPattern: 'triangles'
  },
  
  // Management
  { 
    id: 'inventory', 
    label: 'Inventory', 
    icon: Package, 
    color: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
    category: 'management',
    bgPattern: 'squares'
  },
  { 
    id: 'staff', 
    label: 'Staff', 
    icon: Users, 
    color: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600',
    category: 'management',
    bgPattern: 'circles'
  },
  { 
    id: 'reservations', 
    label: 'Reservations', 
    icon: Calendar, 
    color: 'bg-pink-500',
    gradient: 'from-pink-400 to-pink-600',
    category: 'management',
    bgPattern: 'lines'
  },
  { 
    id: 'floor-plan', 
    label: 'Floor Plan', 
    icon: Map, 
    color: 'bg-teal-500',
    gradient: 'from-teal-400 to-teal-600',
    category: 'management',
    bgPattern: 'hexagons'
  },
  
  // Customer & Orders
  { 
    id: 'online-orders', 
    label: 'Online Orders', 
    icon: Globe, 
    color: 'bg-cyan-500',
    gradient: 'from-cyan-400 to-cyan-600',
    category: 'customer',
    bgPattern: 'waves'
  },
  { 
    id: 'loyalty', 
    label: 'Loyalty', 
    icon: Heart, 
    color: 'bg-rose-500',
    gradient: 'from-rose-400 to-rose-600',
    premium: 'customer-loyalty',
    category: 'customer',
    bgPattern: 'hearts'
  },
  { 
    id: 'customer-feedback', 
    label: 'Feedback', 
    icon: MessageSquare, 
    color: 'bg-sky-500',
    gradient: 'from-sky-400 to-sky-600',
    premium: 'customer-feedback',
    category: 'customer',
    bgPattern: 'bubbles'
  },
  { 
    id: 'review-management', 
    label: 'Reviews', 
    icon: Star, 
    color: 'bg-amber-500',
    gradient: 'from-amber-400 to-amber-600',
    premium: 'review-management',
    category: 'customer',
    bgPattern: 'stars'
  },
  
  // Analytics & Finance
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: TrendingUp, 
    color: 'bg-violet-500',
    gradient: 'from-violet-400 to-violet-600',
    category: 'analytics',
    bgPattern: 'charts'
  },
  { 
    id: 'financial-analytics', 
    label: 'Finance', 
    icon: DollarSign, 
    color: 'bg-green-600',
    gradient: 'from-green-500 to-green-700',
    premium: 'financial-analytics',
    category: 'analytics',
    bgPattern: 'coins'
  },
  { 
    id: 'cost-management', 
    label: 'Costs', 
    icon: Calculator, 
    color: 'bg-lime-600',
    gradient: 'from-lime-500 to-lime-700',
    premium: 'cost-management',
    category: 'analytics',
    bgPattern: 'calculator'
  },
  
  // Enterprise
  { 
    id: 'multi-store', 
    label: 'Multi-Store', 
    icon: Crown, 
    color: 'bg-yellow-500',
    gradient: 'from-yellow-400 to-yellow-600',
    premium: 'multi-store',
    category: 'enterprise',
    bgPattern: 'crown'
  },
  { 
    id: 'ai-recommendations', 
    label: 'AI Insights', 
    icon: Sparkles, 
    color: 'bg-fuchsia-500',
    gradient: 'from-fuchsia-400 to-fuchsia-600',
    premium: 'ai-recommendations',
    category: 'enterprise',
    bgPattern: 'sparkles'
  },
  { 
    id: 'enterprise-analytics', 
    label: 'Enterprise', 
    icon: PieChart, 
    color: 'bg-slate-600',
    gradient: 'from-slate-500 to-slate-700',
    premium: 'advanced-reporting',
    category: 'enterprise',
    bgPattern: 'enterprise'
  },
  { 
    id: 'system-monitoring', 
    label: 'Monitoring', 
    icon: Shield, 
    color: 'bg-gray-600',
    gradient: 'from-gray-500 to-gray-700',
    category: 'enterprise',
    bgPattern: 'shield'
  },
  { 
    id: 'compliance', 
    label: 'Compliance', 
    icon: FileText, 
    color: 'bg-stone-600',
    gradient: 'from-stone-500 to-stone-700',
    category: 'enterprise',
    bgPattern: 'documents'
  }
];

const categories: { [key: string]: { name: string; color: string; icon: React.ComponentType<any> } } = {
  core: { name: 'Core', color: 'bg-blue-100 text-blue-800', icon: Grid3X3 },
  management: { name: 'Management', color: 'bg-purple-100 text-purple-800', icon: Users },
  customer: { name: 'Customer', color: 'bg-rose-100 text-rose-800', icon: Heart },
  analytics: { name: 'Analytics', color: 'bg-green-100 text-green-800', icon: TrendingUp },
  enterprise: { name: 'Enterprise', color: 'bg-amber-100 text-amber-800', icon: Crown }
};

const AppDock = ({ onAppSelect, activeApp }: AppDockProps) => {
  const { isFeatureEnabled } = usePremiumFeatures();
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  const handleAppClick = (app: AppIcon) => {
    if (app.premium && !isFeatureEnabled(app.premium)) {
      return;
    }
    onAppSelect(app.id);
  };

  const categorizedApps = Object.entries(categories).map(([categoryId, categoryInfo]) => ({
    id: categoryId,
    ...categoryInfo,
    apps: apps.filter(app => app.category === categoryId)
  }));

  const getPatternStyle = (pattern: string) => {
    const patterns: { [key: string]: string } = {
      dots: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
      grid: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
      waves: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 2px, transparent 2px, transparent 6px)',
      triangles: 'conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.2), transparent)',
      squares: 'repeating-conic-gradient(rgba(255,255,255,0.1) 0deg 90deg, transparent 90deg 180deg)',
      circles: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 30%, transparent 30%)',
      lines: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 4px)',
      hexagons: 'repeating-conic-gradient(from 30deg at 50% 50%, rgba(255,255,255,0.15) 0deg 60deg, transparent 60deg 120deg)'
    };
    return patterns[pattern] || '';
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-4 shadow-2xl max-w-5xl">
          {showCategories ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">App Categories</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategories(false)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
              </div>
              {categorizedApps.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <category.icon className="h-4 w-4 text-gray-600" />
                    <Badge variant="secondary" className={category.color}>
                      {category.name}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.apps.map((app) => {
                      const Icon = app.icon;
                      const isActive = activeApp === app.id;
                      const isPremium = app.premium && !isFeatureEnabled(app.premium);
                      
                      return (
                        <Tooltip key={app.id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="lg"
                              className={`
                                relative p-3 h-16 w-16 rounded-2xl transition-all duration-300 hover:scale-110
                                ${isActive ? 'scale-110 ring-2 ring-blue-400 ring-offset-2' : ''}
                                ${isPremium ? 'opacity-60' : ''}
                              `}
                              onClick={() => handleAppClick(app)}
                              onMouseEnter={() => setHoveredApp(app.id)}
                              onMouseLeave={() => setHoveredApp(null)}
                            >
                              <div 
                                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${app.gradient || app.color} overflow-hidden`}
                                style={{
                                  backgroundImage: getPatternStyle(app.bgPattern || ''),
                                  backgroundSize: '8px 8px'
                                }}
                              />
                              <Icon className="h-7 w-7 text-white relative z-10 drop-shadow-sm" />
                              {isPremium && (
                                <Crown className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400 z-20 drop-shadow-sm" />
                              )}
                              {isActive && (
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-gray-900 text-white text-xs">
                            <p>{app.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Core apps - always visible */}
                  {apps.filter(app => app.category === 'core').map((app) => {
                    const Icon = app.icon;
                    const isActive = activeApp === app.id;
                    
                    return (
                      <Tooltip key={app.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="lg"
                            className={`
                              relative p-3 h-16 w-16 rounded-2xl transition-all duration-300 hover:scale-110
                              ${isActive ? 'scale-110 ring-2 ring-blue-400 ring-offset-2' : ''}
                            `}
                            onClick={() => handleAppClick(app)}
                            onMouseEnter={() => setHoveredApp(app.id)}
                            onMouseLeave={() => setHoveredApp(null)}
                          >
                            <div 
                              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${app.gradient || app.color} overflow-hidden`}
                              style={{
                                backgroundImage: getPatternStyle(app.bgPattern || ''),
                                backgroundSize: '8px 8px'
                              }}
                            />
                            <Icon className="h-7 w-7 text-white relative z-10 drop-shadow-sm" />
                            {isActive && (
                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-gray-900 text-white text-xs">
                          <p>{app.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  
                  <div className="w-px h-8 bg-gray-300 mx-2" />
                  
                  {/* Recently used or featured apps */}
                  {apps.filter(app => ['analytics', 'inventory', 'staff'].includes(app.id)).map((app) => {
                    const Icon = app.icon;
                    const isActive = activeApp === app.id;
                    const isPremium = app.premium && !isFeatureEnabled(app.premium);
                    
                    return (
                      <Tooltip key={app.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="lg"
                            className={`
                              relative p-2.5 h-14 w-14 rounded-xl transition-all duration-300 hover:scale-110
                              ${isActive ? 'scale-110 ring-2 ring-blue-400 ring-offset-2' : ''}
                              ${isPremium ? 'opacity-60' : ''}
                            `}
                            onClick={() => handleAppClick(app)}
                            onMouseEnter={() => setHoveredApp(app.id)}
                            onMouseLeave={() => setHoveredApp(null)}
                          >
                            <div 
                              className={`absolute inset-0 rounded-xl bg-gradient-to-br ${app.gradient || app.color} overflow-hidden`}
                              style={{
                                backgroundImage: getPatternStyle(app.bgPattern || ''),
                                backgroundSize: '6px 6px'
                              }}
                            />
                            <Icon className="h-6 w-6 text-white relative z-10 drop-shadow-sm" />
                            {isPremium && (
                              <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 z-20 drop-shadow-sm" />
                            )}
                            {isActive && (
                              <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-gray-900 text-white text-xs">
                          <p>{app.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategories(true)}
                  className="h-12 w-12 p-0 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Grid3X3 className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center space-x-1 text-xs text-gray-500">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AppDock;
