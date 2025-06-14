
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, AlertCircle, Clock, CheckCircle, MessageSquare, Send, Eye, BarChart3 } from 'lucide-react';

const pendingReviews = [
  {
    id: 1,
    customer: 'Alex Rodriguez',
    avatar: '/placeholder.svg',
    rating: 2,
    date: '2024-06-13',
    platform: 'Google',
    comment: 'The food took way too long to arrive and when it did, it was cold. Very disappointed with the service.',
    category: 'Service',
    priority: 'high',
    hoursAgo: 2
  },
  {
    id: 2,
    customer: 'Lisa Thompson',
    avatar: '/placeholder.svg',
    rating: 1,
    date: '2024-06-13',
    platform: 'Yelp',
    comment: 'Worst dining experience ever. The staff was rude and the food was terrible. Will never come back.',
    category: 'Overall Experience',
    priority: 'critical',
    hoursAgo: 4
  },
  {
    id: 3,
    customer: 'David Park',
    avatar: '/placeholder.svg',
    rating: 4,
    date: '2024-06-12',
    platform: 'TripAdvisor',
    comment: 'Good food and nice atmosphere. Service could be a bit faster but overall a pleasant experience.',
    category: 'Service',
    priority: 'medium',
    hoursAgo: 18
  }
];

const recentResponses = [
  {
    id: 1,
    customer: 'Maria Garcia',
    rating: 5,
    platform: 'Google',
    originalComment: 'Amazing food and service! Best restaurant in town.',
    response: 'Thank you so much for your wonderful review, Maria! We\'re thrilled you enjoyed your experience.',
    responseDate: '2024-06-12',
    status: 'published'
  },
  {
    id: 2,
    customer: 'Tom Wilson',
    rating: 3,
    platform: 'Yelp',
    originalComment: 'Food was okay, but service was slow during peak hours.',
    response: 'Thank you for your feedback, Tom. We\'re working on improving our service speed during busy periods.',
    responseDate: '2024-06-11',
    status: 'published'
  }
];

const reviewAlerts = [
  {
    type: 'critical',
    message: '2 critical reviews (1-2 stars) need immediate attention',
    count: 2
  },
  {
    type: 'high',
    message: '1 high priority review awaiting response',
    count: 1
  },
  {
    type: 'reminder',
    message: '3 reviews are approaching 24-hour response target',
    count: 3
  }
];

const platformStats = [
  { platform: 'Google', totalReviews: 245, avgRating: 4.6, pendingResponses: 2, responseRate: 85 },
  { platform: 'Yelp', totalReviews: 156, avgRating: 4.3, pendingResponses: 3, responseRate: 72 },
  { platform: 'TripAdvisor', totalReviews: 94, avgRating: 4.5, pendingResponses: 1, responseRate: 90 },
];

const ReviewManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Review Management</h1>
          <p className="text-gray-600">Automated review monitoring and response system</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {reviewAlerts.map((alert, index) => (
          <Alert key={index} className={
            alert.type === 'critical' ? 'border-red-500 bg-red-50' :
            alert.type === 'high' ? 'border-orange-500 bg-orange-50' :
            'border-blue-500 bg-blue-50'
          }>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platformStats.map((platform) => (
          <Card key={platform.platform}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {platform.platform}
                <Badge variant={platform.pendingResponses > 0 ? "destructive" : "default"}>
                  {platform.pendingResponses} pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Reviews:</span>
                  <span className="font-medium">{platform.totalReviews}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Rating:</span>
                  <span className="font-medium flex items-center">
                    {platform.avgRating}
                    <Star className="h-3 w-3 text-yellow-500 ml-1" />
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response Rate:</span>
                  <span className="font-medium">{platform.responseRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Reviews ({pendingReviews.length})</TabsTrigger>
          <TabsTrigger value="responded">Recent Responses</TabsTrigger>
          <TabsTrigger value="templates">Response Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviews Awaiting Response</CardTitle>
              <CardDescription>Prioritized by urgency and impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.customer.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{review.customer}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>{review.hoursAgo}h ago</span>
                            <Badge variant="outline">{review.platform}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant={
                          review.priority === 'critical' ? 'destructive' :
                          review.priority === 'high' ? 'secondary' : 'default'
                        }>
                          {review.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{review.comment}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{review.category}</Badge>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview Response
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Draft Response</DialogTitle>
                              <DialogDescription>
                                Craft your response to {review.customer}'s review
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium mb-1">Original Review:</p>
                                <p className="text-sm">{review.comment}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Your Response:</label>
                                <Textarea 
                                  placeholder="Type your response here..."
                                  className="mt-1"
                                  rows={4}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">Save Draft</Button>
                                <Button>
                                  <Send className="h-4 w-4 mr-1" />
                                  Send Response
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Quick Response
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responded" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Responses</CardTitle>
              <CardDescription>Your latest review responses and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentResponses.map((response) => (
                  <div key={response.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{response.customer}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>Responded on {response.responseDate}</span>
                          <Badge variant="outline">{response.platform}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= response.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {response.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium mb-1">Customer Review:</p>
                        <p className="text-sm text-gray-700">{response.originalComment}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded">
                        <p className="text-sm font-medium mb-1">Your Response:</p>
                        <p className="text-sm text-gray-700">{response.response}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Templates</CardTitle>
              <CardDescription>Create and manage templates for common review types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  + Create New Template
                </Button>
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Positive Food Review</h4>
                      <Badge>Most Used</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Thank you so much for your wonderful review! We're thrilled you enjoyed [DISH]. 
                      Your feedback motivates our team to continue delivering exceptional dining experiences.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Use Template</Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Service Issue Response</h4>
                      <Badge variant="secondary">Critical</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      We sincerely apologize for the service issues you experienced. This is not the standard we aim for. 
                      We'd love to make this right - please contact us directly at [CONTACT].
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Use Template</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Set up automatic responses and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Auto-thank for 5-star reviews</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Automatically send a thank you message for all 5-star reviews within 2 hours
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit Rule</Button>
                    <Button size="sm" variant="destructive">Disable</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Critical review alerts</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Send immediate notifications for 1-2 star reviews to management team
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit Rule</Button>
                    <Button size="sm" variant="destructive">Disable</Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  + Add New Automation Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewManagement;
