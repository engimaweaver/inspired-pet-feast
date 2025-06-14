
import { useState } from 'react';
import { ShoppingCart, Clock, Truck, MapPin, Phone, CreditCard, CheckCircle, AlertCircle, Star, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  prepTime: number;
  isAvailable: boolean;
  isPopular?: boolean;
  allergens?: string[];
}

interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface OnlineOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'received' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'completed';
  orderTime: string;
  estimatedTime: string;
  paymentMethod: string;
  specialInstructions?: string;
}

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, basil leaves',
    price: 18.00,
    category: 'Pizza',
    image: '/placeholder.svg',
    rating: 4.8,
    prepTime: 15,
    isAvailable: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon butter sauce',
    price: 32.00,
    category: 'Seafood',
    image: '/placeholder.svg',
    rating: 4.9,
    prepTime: 20,
    isAvailable: true,
    allergens: ['Fish']
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
    price: 14.00,
    category: 'Salads',
    image: '/placeholder.svg',
    rating: 4.6,
    prepTime: 10,
    isAvailable: true
  },
  {
    id: '4',
    name: 'Chicken Burger',
    description: 'Grilled chicken breast, lettuce, tomato, mayo',
    price: 16.50,
    category: 'Burgers',
    image: '/placeholder.svg',
    rating: 4.7,
    prepTime: 12,
    isAvailable: true,
    isPopular: true
  }
];

const mockOnlineOrders: OnlineOrder[] = [
  {
    id: '1',
    orderNumber: 'ON-1234',
    customerName: 'Emma Wilson',
    customerPhone: '+1 555-0123',
    customerEmail: 'emma@email.com',
    orderType: 'delivery',
    deliveryAddress: '123 Oak Street, Downtown',
    items: [
      { id: '1', menuItem: mockMenuItems[0], quantity: 2 },
      { id: '2', menuItem: mockMenuItems[3], quantity: 1 }
    ],
    subtotal: 52.50,
    tax: 4.20,
    deliveryFee: 3.99,
    total: 60.69,
    status: 'preparing',
    orderTime: '14:30',
    estimatedTime: '15:15',
    paymentMethod: 'Credit Card',
    specialInstructions: 'Please ring doorbell'
  },
  {
    id: '2',
    orderNumber: 'ON-1235',
    customerName: 'Robert Chen',
    customerPhone: '+1 555-0124',
    orderType: 'pickup',
    items: [
      { id: '1', menuItem: mockMenuItems[1], quantity: 1 },
      { id: '2', menuItem: mockMenuItems[2], quantity: 2 }
    ],
    subtotal: 60.00,
    tax: 4.80,
    deliveryFee: 0,
    total: 64.80,
    status: 'ready',
    orderTime: '14:45',
    estimatedTime: '15:05',
    paymentMethod: 'Digital Wallet'
  }
];

const EnhancedOnlineOrdering = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<OnlineOrder[]>(mockOnlineOrders);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Pizza', 'Burgers', 'Salads', 'Seafood'];

  const filteredMenuItems = mockMenuItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const updateOrderStatus = (orderId: string, status: OnlineOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addToCart = (menuItem: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return prev.map(item => 
          item.menuItem.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: Date.now().toString(), menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Online Ordering System</h1>
          <p className="text-gray-600">Manage online orders and menu for delivery/pickup</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-4 w-4 mr-1" />
            Online Menu Active
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Active Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="analytics">Order Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <CardDescription>
                        {order.customerName} • {order.orderTime}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline" className={order.orderType === 'delivery' ? 'text-blue-600' : 'text-green-600'}>
                        {order.orderType === 'delivery' ? <Truck className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {order.orderType}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.menuItem.name}</span>
                        <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee</span>
                        <span>${order.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.customerPhone}
                    </div>
                    {order.deliveryAddress && (
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {order.deliveryAddress}
                      </div>
                    )}
                    {order.specialInstructions && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {order.specialInstructions}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'received' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                        Start Preparing
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && order.orderType === 'delivery' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'out-for-delivery')}>
                        Out for Delivery
                      </Button>
                    )}
                    {order.status === 'out-for-delivery' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                        Mark Delivered
                      </Button>
                    )}
                    {(order.status === 'ready' && order.orderType === 'pickup') && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>
                        Complete Pickup
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <div className="flex gap-4 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Items' : category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-gray-100 rounded-md mb-3 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                    {item.isPopular && (
                      <Badge className="absolute top-2 left-2 bg-orange-500">
                        Popular
                      </Badge>
                    )}
                    <Badge 
                      className={`absolute top-2 right-2 ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="mt-1">{item.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {item.rating}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {item.prepTime} min prep
                    </div>
                    {item.allergens && (
                      <Badge variant="outline" className="text-xs">
                        Contains: {item.allergens.join(', ')}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={!item.isAvailable}
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,247</div>
                <p className="text-xs text-muted-foreground">+8% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">16 min</div>
                <p className="text-xs text-muted-foreground">-2 min from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">vs 32% pickup</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
              <CardDescription>Most ordered items today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMenuItems.filter(item => item.isPopular).map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{Math.floor(Math.random() * 20 + 5)} orders</p>
                      <p className="text-sm text-gray-600">Today</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedOnlineOrdering;
