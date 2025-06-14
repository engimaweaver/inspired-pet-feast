
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Clock, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  Eye,
  Phone,
  MapPin
} from 'lucide-react';

interface OnlineOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    modifications?: string[];
  }>;
  total: number;
  orderType: 'delivery' | 'pickup';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'completed';
  orderTime: string;
  estimatedTime: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  deliveryFee?: number;
  specialInstructions?: string;
}

const mockOrders: OnlineOrder[] = [
  {
    id: 'ORD-001',
    customerName: 'Alice Johnson',
    customerPhone: '+1-555-0301',
    customerAddress: '123 Main St, Downtown',
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 18.00 },
      { name: 'Caesar Salad', quantity: 1, price: 14.00, modifications: ['No croutons', 'Extra dressing'] }
    ],
    total: 52.99,
    orderType: 'delivery',
    status: 'preparing',
    orderTime: '18:30',
    estimatedTime: '19:15',
    paymentStatus: 'paid',
    deliveryFee: 2.99,
    specialInstructions: 'Ring doorbell, apartment 2B'
  },
  {
    id: 'ORD-002',
    customerName: 'Bob Martinez',
    customerPhone: '+1-555-0302',
    items: [
      { name: 'Grilled Salmon', quantity: 1, price: 32.00 },
      { name: 'Garlic Bread', quantity: 1, price: 6.00 }
    ],
    total: 38.00,
    orderType: 'pickup',
    status: 'ready',
    orderTime: '18:45',
    estimatedTime: '19:00',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-003',
    customerName: 'Carol Davis',
    customerPhone: '+1-555-0303',
    customerAddress: '456 Oak Ave, Uptown',
    items: [
      { name: 'Chicken Burger', quantity: 3, price: 16.50 },
      { name: 'French Fries', quantity: 2, price: 8.00 }
    ],
    total: 63.49,
    orderType: 'delivery',
    status: 'out_for_delivery',
    orderTime: '18:15',
    estimatedTime: '19:00',
    paymentStatus: 'paid',
    deliveryFee: 3.99
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-blue-100 text-blue-800';
    case 'preparing': return 'bg-orange-100 text-orange-800';
    case 'ready': return 'bg-green-100 text-green-800';
    case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <AlertCircle className="h-4 w-4" />;
    case 'confirmed': return <CheckCircle className="h-4 w-4" />;
    case 'preparing': return <Clock className="h-4 w-4" />;
    case 'ready': return <CheckCircle className="h-4 w-4" />;
    case 'out_for_delivery': return <Truck className="h-4 w-4" />;
    case 'delivered': return <CheckCircle className="h-4 w-4" />;
    case 'completed': return <CheckCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const OnlineOrderingSystem = () => {
  const [orders, setOrders] = useState<OnlineOrder[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'delivery' && order.orderType === 'delivery') ||
                      (selectedTab === 'pickup' && order.orderType === 'pickup');
    
    return matchesSearch && matchesTab;
  });

  const handleStatusUpdate = (orderId: string, newStatus: OnlineOrder['status']) => {
    setOrders(prev =>
      prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
    );
  };

  const getNextStatus = (currentStatus: string, orderType: string) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: orderType === 'delivery' ? 'out_for_delivery' : 'completed',
      out_for_delivery: 'delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const pendingOrders = orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const readyOrders = orders.filter(o => ['ready', 'out_for_delivery'].includes(o.status)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Online Ordering System</h1>
          <p className="text-gray-600 mt-1">Manage delivery and pickup orders from your online channels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Eye className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Preparing</p>
                <p className="text-2xl font-bold">{preparingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold">{readyOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by customer, order ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="pickup">Pickup</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="p-6 space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                        </Badge>
                        <Badge variant="outline">
                          {order.orderType === 'delivery' ? <Truck className="h-3 w-3 mr-1" /> : <ShoppingCart className="h-3 w-3 mr-1" />}
                          {order.orderType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{order.customerName}</span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {order.customerPhone}
                        </span>
                        <span>Order: {order.orderTime}</span>
                        <span>ETA: {order.estimatedTime}</span>
                      </div>
                      {order.customerAddress && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {order.customerAddress}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{order.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.deliveryFee && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Delivery Fee</span>
                        <span>${order.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {order.specialInstructions && (
                    <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                      <p className="text-sm"><strong>Special Instructions:</strong> {order.specialInstructions}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {order.status !== 'completed' && order.status !== 'delivered' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status, order.orderType) as OnlineOrder['status'])}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {order.status === 'pending' && 'Confirm Order'}
                        {order.status === 'confirmed' && 'Start Preparing'}
                        {order.status === 'preparing' && 'Mark Ready'}
                        {order.status === 'ready' && order.orderType === 'delivery' && 'Out for Delivery'}
                        {order.status === 'ready' && order.orderType === 'pickup' && 'Mark Completed'}
                        {order.status === 'out_for_delivery' && 'Mark Delivered'}
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call Customer
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-gray-600">No orders match your current search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineOrderingSystem;
