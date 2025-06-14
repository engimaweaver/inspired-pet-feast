
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Users, Utensils, Timer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready';
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  customerName?: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
  items: OrderItem[];
  totalItems: number;
  orderTime: string;
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'preparing' | 'ready' | 'completed';
  specialInstructions?: string;
}

const mockOrders: KitchenOrder[] = [
  {
    id: '1',
    orderNumber: '#1234',
    tableNumber: 'Table 5',
    orderType: 'dine-in',
    items: [
      { id: '1a', name: 'Grilled Salmon', quantity: 1, status: 'preparing' },
      { id: '1b', name: 'Caesar Salad', quantity: 1, status: 'ready' },
      { id: '1c', name: 'Garlic Bread', quantity: 2, status: 'pending' }
    ],
    totalItems: 4,
    orderTime: '14:30',
    estimatedTime: 25,
    priority: 'high',
    status: 'preparing',
    specialInstructions: 'No onions on salad'
  },
  {
    id: '2',
    orderNumber: '#1235',
    customerName: 'John Smith',
    orderType: 'takeout',
    items: [
      { id: '2a', name: 'Margherita Pizza', quantity: 1, status: 'preparing' },
      { id: '2b', name: 'Buffalo Wings', quantity: 1, status: 'preparing' }
    ],
    totalItems: 2,
    orderTime: '14:35',
    estimatedTime: 20,
    priority: 'medium',
    status: 'preparing'
  },
  {
    id: '3',
    orderNumber: '#1236',
    tableNumber: 'Table 12',
    orderType: 'dine-in',
    items: [
      { id: '3a', name: 'Beef Burger', quantity: 2, status: 'pending' },
      { id: '3b', name: 'French Fries', quantity: 2, status: 'pending' },
      { id: '3c', name: 'Soft Drinks', quantity: 2, status: 'ready' }
    ],
    totalItems: 6,
    orderTime: '14:40',
    estimatedTime: 30,
    priority: 'low',
    status: 'new'
  }
];

const KitchenDisplaySystem = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>(mockOrders);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getElapsedTime = (orderTime: string) => {
    const orderDate = new Date();
    const [hours, minutes] = orderTime.split(':').map(Number);
    orderDate.setHours(hours, minutes, 0, 0);
    
    const diff = currentTime.getTime() - orderDate.getTime();
    return Math.floor(diff / (1000 * 60)); // minutes
  };

  const updateItemStatus = (orderId: string, itemId: string, newStatus: 'pending' | 'preparing' | 'ready') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        
        // Update order status based on items
        let orderStatus: 'new' | 'preparing' | 'ready' | 'completed' = 'new';
        const allReady = updatedItems.every(item => item.status === 'ready');
        const anyPreparing = updatedItems.some(item => item.status === 'preparing');
        
        if (allReady) orderStatus = 'ready';
        else if (anyPreparing) orderStatus = 'preparing';
        
        return { ...order, items: updatedItems, status: orderStatus };
      }
      return order;
    }));
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'completed' } : order
    ));
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const OrderCard = ({ order }: { order: KitchenOrder }) => {
    const elapsedTime = getElapsedTime(order.orderTime);
    const isOverdue = elapsedTime > order.estimatedTime;
    const completedItems = order.items.filter(item => item.status === 'ready').length;
    const progress = (completedItems / order.totalItems) * 100;

    return (
      <Card className={`${isOverdue ? 'border-red-300 bg-red-50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(order.priority)}`} />
              <Badge variant="outline" className="text-xs">
                {order.orderType}
              </Badge>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {elapsedTime}m
              </div>
              <div className="text-xs text-gray-500">
                Est: {order.estimatedTime}m
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <CardDescription>
              {order.tableNumber || order.customerName} • {order.orderTime}
            </CardDescription>
            <Progress value={progress} className="w-20 h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.specialInstructions && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
              <p className="text-sm text-yellow-800">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                {order.specialInstructions}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.quantity}x {item.name}</span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  {item.specialInstructions && (
                    <p className="text-xs text-gray-600 mt-1">{item.specialInstructions}</p>
                  )}
                </div>
                <div className="flex space-x-1">
                  {item.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateItemStatus(order.id, item.id, 'preparing')}
                    >
                      Start
                    </Button>
                  )}
                  {item.status === 'preparing' && (
                    <Button
                      size="sm"
                      onClick={() => updateItemStatus(order.id, item.id, 'ready')}
                    >
                      Ready
                    </Button>
                  )}
                  {item.status === 'ready' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {order.status === 'ready' && (
            <Button 
              className="w-full" 
              onClick={() => completeOrder(order.id)}
            >
              Complete Order
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kitchen Display System</h1>
          <p className="text-gray-600">Real-time order management for kitchen staff</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-sm text-gray-600">
            {orders.filter(o => o.status !== 'completed').length} active orders
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getOrdersByStatus('new').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparing</CardTitle>
            <Timer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {getOrdersByStatus('preparing').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getOrdersByStatus('ready').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Prep Time</CardTitle>
            <Utensils className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              18m
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.filter(order => order.status !== 'completed').map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default KitchenDisplaySystem;
