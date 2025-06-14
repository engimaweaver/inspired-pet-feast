
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Star, MessageCircle, TrendingUp, TrendingDown, ThumbsUp, ThumbsDown, Reply, Filter } from 'lucide-react';

const satisfactionTrends = [
  { month: 'Jan', rating: 4.2, reviews: 45 },
  { month: 'Feb', rating: 4.1, reviews: 52 },
  { month: 'Mar', rating: 4.4, reviews: 38 },
  { month: 'Apr', rating: 4.3, reviews: 61 },
  { month: 'May', rating: 4.6, reviews: 55 },
  { month: 'Jun', rating: 4.5, reviews: 67 },
];

const ratingDistribution = [
  { stars: 5, count: 285, percentage: 58 },
  { stars: 4, count: 125, percentage: 25 },
  { stars: 3, count: 50, percentage: 10 },
  { stars: 2, count: 20, percentage: 4 },
  { stars: 1, count: 15, percentage: 3 },
];

const recentFeedback = [
  {
    id: 1,
    customer: 'Sarah Johnson',
    avatar: '/placeholder.svg',
    rating: 5,
    date: '2024-06-12',
    platform: 'Google',
    comment: 'Absolutely loved the new seasonal menu! The grilled salmon was perfectly cooked and the service was exceptional.',
    category: 'Food Quality',
    sentiment: 'positive',
    responded: true
  },
  {
    id: 2,
    customer: 'Mike Chen',
    avatar: '/placeholder.svg',
    rating: 2,
    date: '2024-06-11',
    platform: 'Yelp',
    comment: 'The wait time was way too long despite having a reservation. Food was good but the service needs improvement.',
    category: 'Service',
    sentiment: 'negative',
    responded: false
  },
  {
    id: 3,
    customer: 'Emily Davis',
    avatar: '/placeholder.svg',
    rating: 4,
    date: '2024-06-10',
    platform: 'TripAdvisor',
    comment: 'Great atmosphere and delicious food. The only downside was that it was quite noisy during peak hours.',
    category: 'Ambiance',
    sentiment: 'positive',
    responded: true
  },
  {
    id: 4,
    customer: 'John Smith',
    avatar: '/placeholder.svg',
    rating: 5,
    date: '2024-06-09',
    platform: 'Google',
    comment: 'Best restaurant experience in town! Every dish was perfect and the staff was incredibly friendly.',
    category: 'Overall Experience',
    sentiment: 'positive',
    responded: false
  }
];

const categoryBreakdown = [
  { category: 'Food Quality', positive: 85, negative: 15, total: 156 },
  { category: 'Service', positive: 72, negative: 28, total: 142 },
  { category: 'Ambiance', positive: 78, negative: 22, total: 98 },
  { category: 'Value', positive: 65, negative: 35, total: 87 },
  { category: 'Cleanliness', positive: 92, negative: 8, total: 76 },
];

const CustomerFeedback = () => {
  const averageRating = 4.5;
  const totalReviews = 495;
  const responseRate = 78;
  const monthlyGrowth = 12.3;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Feedback</h1>
          <p className="text-gray-600">Review management and customer satisfaction tracking</p>
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="yelp">Yelp</SelectItem>
              <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {averageRating}
              <div className="flex ml-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= averageRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3 from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{monthlyGrowth}% this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseRate}%</div>
            <Progress value={responseRate} className="mt-2" />
            <div className="text-xs text-gray-600 mt-1">
              Target: 85%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Recent Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="responses">Response Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>How customers rate your restaurant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="flex items-center space-x-3">
                      <div className="flex items-center w-16">
                        <span className="text-sm font-medium">{rating.stars}</span>
                        <Star className="h-4 w-4 text-yellow-500 ml-1" />
                      </div>
                      <div className="flex-1">
                        <Progress value={rating.percentage} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-600 w-12 text-right">
                        {rating.count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trends</CardTitle>
                <CardDescription>Monthly rating and review volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-64">
                  <LineChart data={satisfactionTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3.5, 5]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Customer Reviews</CardTitle>
              <CardDescription>Latest feedback from customers across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={feedback.avatar} />
                          <AvatarFallback>{feedback.customer.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{feedback.customer}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{feedback.date}</span>
                            <Badge variant="outline">{feedback.platform}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant={feedback.sentiment === 'positive' ? 'default' : 'destructive'}>
                          {feedback.sentiment}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{feedback.comment}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{feedback.category}</Badge>
                      <div className="flex space-x-2">
                        {feedback.responded ? (
                          <Badge variant="default">Responded</Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback by Category</CardTitle>
              <CardDescription>Sentiment analysis across different aspects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{category.category}</h4>
                      <span className="text-sm text-gray-600">{category.total} reviews</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${category.positive}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {category.positive}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Templates</CardTitle>
              <CardDescription>Quick response templates for common feedback types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Positive Food Review</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    "Thank you so much for your wonderful review! We're thrilled you enjoyed [specific dish]. 
                    Your feedback motivates our team to continue delivering exceptional dining experiences."
                  </p>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Service Complaint</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    "We sincerely apologize for the service issues you experienced. This is not the standard we aim for. 
                    We'd love to make this right - please contact us directly at [contact info]."
                  </p>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">General Thank You</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    "Thank you for taking the time to share your experience! We appreciate your feedback and 
                    look forward to serving you again soon."
                  </p>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerFeedback;
