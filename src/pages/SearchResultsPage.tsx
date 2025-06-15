
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StandardizedCard } from '@/components/ui/standardized-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Clock, Users, Package, Receipt } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);

  const mockResults = {
    orders: [
      { id: '001', customer: 'John Doe', total: '₹450', status: 'completed', time: '2 hours ago' },
      { id: '002', customer: 'Jane Smith', total: '₹320', status: 'pending', time: '1 hour ago' }
    ],
    customers: [
      { id: '1', name: 'John Doe', phone: '+91 98765 43210', lastOrder: '2 hours ago' },
      { id: '2', name: 'Jane Smith', phone: '+91 87654 32109', lastOrder: '1 hour ago' }
    ],
    menu: [
      { id: '1', name: 'Chicken Biryani', category: 'Main Course', price: '₹250', available: true },
      { id: '2', name: 'Paneer Butter Masala', category: 'Main Course', price: '₹180', available: true }
    ],
    inventory: [
      { id: '1', item: 'Basmati Rice', stock: '50 kg', status: 'in-stock', lastUpdated: '1 day ago' },
      { id: '2', item: 'Chicken', stock: '25 kg', status: 'low-stock', lastUpdated: '3 hours ago' }
    ]
  };

  useEffect(() => {
    if (query) {
      setLoading(true);
      // Simulate search delay
      setTimeout(() => setLoading(false), 1000);
    }
  }, [query]);

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    setSearchParams({ q: newQuery });
  };

  const getResultCount = () => {
    return mockResults.orders.length + mockResults.customers.length + 
           mockResults.menu.length + mockResults.inventory.length;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Search className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Search Results</h1>
          <p className="text-gray-600">
            {query ? `Showing results for "${query}"` : 'Enter a search term to begin'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders, customers, menu items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {query && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Found {getResultCount()} results
          </span>
          <Badge variant="secondary">{query}</Badge>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Search className="h-8 w-8 animate-pulse text-gray-400" />
        </div>
      ) : query ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Results ({getResultCount()})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({mockResults.orders.length})</TabsTrigger>
            <TabsTrigger value="customers">Customers ({mockResults.customers.length})</TabsTrigger>
            <TabsTrigger value="menu">Menu ({mockResults.menu.length})</TabsTrigger>
            <TabsTrigger value="inventory">Inventory ({mockResults.inventory.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {/* Orders Section */}
            {mockResults.orders.length > 0 && (
              <StandardizedCard title="Orders" badge={{ text: mockResults.orders.length.toString() }}>
                <div className="space-y-3">
                  {mockResults.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Receipt className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total}</p>
                        <p className="text-sm text-gray-600">{order.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </StandardizedCard>
            )}

            {/* Customers Section */}
            {mockResults.customers.length > 0 && (
              <StandardizedCard title="Customers" badge={{ text: mockResults.customers.length.toString() }}>
                <div className="space-y-3">
                  {mockResults.customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last order</p>
                        <p className="text-sm">{customer.lastOrder}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </StandardizedCard>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <StandardizedCard title="Order Results">
              <div className="space-y-3">
                {mockResults.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Receipt className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{order.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">{order.total}</p>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </StandardizedCard>
          </TabsContent>

          {/* Similar structure for other tabs */}
        </Tabs>
      ) : (
        <StandardizedCard title="Search Tips" size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">What you can search for:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Order numbers (#001, #002)</li>
                <li>• Customer names or phone numbers</li>
                <li>• Menu item names</li>
                <li>• Inventory items</li>
                <li>• Staff names</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Search tips:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use specific terms for better results</li>
                <li>• Try partial matches</li>
                <li>• Use filters to narrow results</li>
                <li>• Search is case-insensitive</li>
              </ul>
            </div>
          </div>
        </StandardizedCard>
      )}
    </div>
  );
};

export default SearchResultsPage;
