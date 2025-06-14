
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';

const orders = [
  {
    id: '#ORD-001',
    customer: 'John Smith',
    items: 'Margherita Pizza, Caesar Salad',
    total: '$28.50',
    status: 'preparing',
    time: '12:30 PM',
    table: 'Table 5'
  },
  {
    id: '#ORD-002',
    customer: 'Emma Johnson',
    items: 'Grilled Salmon, Garlic Bread',
    total: '$42.00',
    status: 'ready',
    time: '12:25 PM',
    table: 'Table 12'
  },
  {
    id: '#ORD-003',
    customer: 'Michael Brown',
    items: 'Chicken Burger, Fries, Coke',
    total: '$18.75',
    status: 'delivered',
    time: '12:15 PM',
    table: 'Table 3'
  },
  {
    id: '#ORD-004',
    customer: 'Sarah Wilson',
    items: 'Pasta Carbonara, Wine',
    total: '$35.20',
    status: 'pending',
    time: '12:35 PM',
    table: 'Table 8'
  },
];

const OrdersTable = () => {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                  <div className="text-sm text-gray-500">{order.table}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {order.items}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {order.total}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(order.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.time}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
