
import { useState } from 'react';
import { Users, Clock, CheckCircle, XCircle, Store, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Table, TableStatus } from './FloorPlanScreen';

interface Store {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
}

const AdminFloorPlanScreen = () => {
  const { toast } = useToast();
  const [selectedStore, setSelectedStore] = useState<string>('all');

  // Mock stores data
  const stores: Store[] = [
    { id: '1', name: 'Downtown Cafe', location: 'Main Street', status: 'active' },
    { id: '2', name: 'Mall Outlet', location: 'City Mall', status: 'active' },
    { id: '3', name: 'Airport Branch', location: 'Terminal 2', status: 'active' },
    { id: '4', name: 'Suburban Store', location: 'Oak Avenue', status: 'inactive' },
  ];

  // Mock multi-store table data
  const allStoreTables: Record<string, Table[]> = {
    '1': [
      { id: '1-1', number: 1, seats: 2, status: 'available', position: { x: 100, y: 100 } },
      { id: '1-2', number: 2, seats: 4, status: 'occupied', position: { x: 300, y: 100 }, 
        currentBill: { id: 'bill-1-1', items: [], total: 450, startTime: '2024-06-14T12:30:00' } },
      { id: '1-3', number: 3, seats: 6, status: 'reserved', position: { x: 500, y: 100 },
        reservation: { time: '19:00', customerName: 'Smith Family' } },
    ],
    '2': [
      { id: '2-1', number: 1, seats: 4, status: 'occupied', position: { x: 100, y: 100 },
        currentBill: { id: 'bill-2-1', items: [], total: 320, startTime: '2024-06-14T11:45:00' } },
      { id: '2-2', number: 2, seats: 2, status: 'available', position: { x: 300, y: 100 } },
      { id: '2-3', number: 3, seats: 8, status: 'cleaning', position: { x: 500, y: 100 } },
    ],
    '3': [
      { id: '3-1', number: 1, seats: 2, status: 'available', position: { x: 100, y: 100 } },
      { id: '3-2', number: 2, seats: 4, status: 'occupied', position: { x: 300, y: 100 },
        currentBill: { id: 'bill-3-1', items: [], total: 180, startTime: '2024-06-14T13:00:00' } },
    ],
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800';
      case 'occupied': return 'bg-red-100 border-red-300 text-red-800';
      case 'reserved': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'cleaning': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: TableStatus) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'occupied': return <Users className="h-4 w-4" />;
      case 'reserved': return <Clock className="h-4 w-4" />;
      case 'cleaning': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStoreStats = (storeId: string) => {
    const tables = allStoreTables[storeId] || [];
    const available = tables.filter(t => t.status === 'available').length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const reserved = tables.filter(t => t.status === 'reserved').length;
    const cleaning = tables.filter(t => t.status === 'cleaning').length;
    const revenue = tables.filter(t => t.currentBill).reduce((sum, t) => sum + (t.currentBill?.total || 0), 0);
    
    return { available, occupied, reserved, cleaning, total: tables.length, revenue };
  };

  const getAllStoresStats = () => {
    const allStats = Object.keys(allStoreTables).map(storeId => getStoreStats(storeId));
    return allStats.reduce((acc, stats) => ({
      available: acc.available + stats.available,
      occupied: acc.occupied + stats.occupied,
      reserved: acc.reserved + stats.reserved,
      cleaning: acc.cleaning + stats.cleaning,
      total: acc.total + stats.total,
      revenue: acc.revenue + stats.revenue,
    }), { available: 0, occupied: 0, reserved: 0, cleaning: 0, total: 0, revenue: 0 });
  };

  const displayStats = selectedStore === 'all' ? getAllStoresStats() : getStoreStats(selectedStore);
  const displayTables = selectedStore === 'all' 
    ? Object.values(allStoreTables).flat() 
    : allStoreTables[selectedStore] || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header with Store Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Store className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold">Multi-Store Floor Plan Management</h1>
            <p className="text-gray-600">Manage tables across all restaurant locations</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {stores.filter(store => store.status === 'active').map(store => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{displayStats.available}</div>
            <div className="text-sm text-gray-600">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{displayStats.occupied}</div>
            <div className="text-sm text-gray-600">Occupied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{displayStats.reserved}</div>
            <div className="text-sm text-gray-600">Reserved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{displayStats.cleaning}</div>
            <div className="text-sm text-gray-600">Cleaning</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">₹{displayStats.revenue}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Store Grid View for All Stores */}
      {selectedStore === 'all' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stores.filter(store => store.status === 'active').map(store => {
            const storeStats = getStoreStats(store.id);
            const storeTables = allStoreTables[store.id] || [];
            
            return (
              <Card key={store.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Store className="h-5 w-5" />
                        <span>{store.name}</span>
                      </div>
                      <p className="text-sm text-gray-500 font-normal">{store.location}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {storeStats.available} Available
                      </Badge>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {storeStats.occupied} Occupied
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {storeTables.slice(0, 6).map(table => (
                      <div
                        key={table.id}
                        className={`p-2 rounded border text-center text-xs ${getStatusColor(table.status)}`}
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {getStatusIcon(table.status)}
                          <span>T{table.number}</span>
                        </div>
                        <div>{table.seats} seats</div>
                        {table.currentBill && (
                          <div className="font-semibold">₹{table.currentBill.total}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Revenue: ₹{storeStats.revenue}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedStore(store.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Individual Store Floor Plan */
        <Card className="min-h-[600px]">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {stores.find(s => s.id === selectedStore)?.name} Floor Plan
              <Button size="sm" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-50 rounded-lg p-4 min-h-[500px] overflow-hidden">
              {displayTables.map((table) => (
                <div
                  key={table.id}
                  className={`absolute cursor-pointer transition-all duration-200 hover:scale-105 ${getStatusColor(table.status)} border-2 rounded-lg p-4 min-w-[120px] shadow-sm hover:shadow-md`}
                  style={{
                    left: `${table.position.x}px`,
                    top: `${table.position.y}px`,
                  }}
                  onClick={() => {
                    toast({
                      title: "Table Selected",
                      description: `Selected Table ${table.number} - ${table.status}`,
                    });
                  }}
                >
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-1">
                      {getStatusIcon(table.status)}
                      <span className="font-bold">Table {table.number}</span>
                    </div>
                    <div className="text-sm">
                      <div>{table.seats} seats</div>
                      {table.status === 'occupied' && table.currentBill && (
                        <div className="font-semibold text-green-600">
                          ₹{table.currentBill.total}
                        </div>
                      )}
                      {table.status === 'reserved' && table.reservation && (
                        <div className="text-xs">
                          {table.reservation.time} - {table.reservation.customerName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md">
                <h4 className="font-semibold mb-2">Legend</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                    <span>Reserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                    <span>Cleaning</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminFloorPlanScreen;
