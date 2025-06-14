
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Users, Star, DollarSign } from 'lucide-react';

interface RecommendationData {
  id: string;
  type: 'menu' | 'pricing' | 'promotion' | 'staffing';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  estimatedRevenue: string;
  timeframe: string;
}

const mockRecommendations: RecommendationData[] = [
  {
    id: '1',
    type: 'menu',
    title: 'Promote Grilled Salmon',
    description: 'Based on current inventory and customer preferences, promoting salmon can increase profit margins by 15%',
    impact: 'high',
    confidence: 89,
    estimatedRevenue: '+$2,400/month',
    timeframe: '2 weeks'
  },
  {
    id: '2',
    type: 'pricing',
    title: 'Dynamic Pizza Pricing',
    description: 'Implement time-based pricing for pizzas during peak hours (6-8 PM)',
    impact: 'medium',
    confidence: 76,
    estimatedRevenue: '+$1,800/month',
    timeframe: '1 week'
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Weekend Dessert Bundle',
    description: 'Create dessert + coffee bundle for weekend customers to increase average order value',
    impact: 'medium',
    confidence: 82,
    estimatedRevenue: '+$1,200/month',
    timeframe: '3 days'
  },
  {
    id: '4',
    type: 'staffing',
    title: 'Optimize Friday Staff Schedule',
    description: 'Add one server during 7-9 PM on Fridays based on wait time analysis',
    impact: 'high',
    confidence: 91,
    estimatedRevenue: '+$3,200/month',
    timeframe: '1 day'
  }
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'menu': return <Star className="h-4 w-4" />;
    case 'pricing': return <DollarSign className="h-4 w-4" />;
    case 'promotion': return <TrendingUp className="h-4 w-4" />;
    case 'staffing': return <Users className="h-4 w-4" />;
    default: return <Brain className="h-4 w-4" />;
  }
};

const AIRecommendationEngine = () => {
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleImplement = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    console.log(`Implementing recommendation ${id}`);
  };

  const handleDismiss = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              AI Recommendation Engine
            </h1>
            <p className="text-gray-600 mt-1">AI-powered insights to optimize your restaurant operations</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Analyzing your data...</h3>
          <p className="text-gray-600">Our AI is processing sales patterns, customer behavior, and operational data to generate personalized recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            AI Recommendation Engine
          </h1>
          <p className="text-gray-600 mt-1">AI-powered insights to optimize your restaurant operations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Brain className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(rec.type)}
                  <CardTitle className="text-lg">{rec.title}</CardTitle>
                </div>
                <Badge className={getImpactColor(rec.impact)}>
                  {rec.impact} impact
                </Badge>
              </div>
              <CardDescription>{rec.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">AI Confidence:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                    <span className="font-medium">{rec.confidence}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Est. Revenue Impact:</span>
                    <p className="font-semibold text-green-600">{rec.estimatedRevenue}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Implementation:</span>
                    <p className="font-semibold">{rec.timeframe}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleImplement(rec.id)}
                  >
                    Implement
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDismiss(rec.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">All recommendations implemented!</h3>
          <p className="text-gray-600">Great job! Check back later for new AI-generated insights.</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationEngine;
