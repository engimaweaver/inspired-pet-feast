
import { useState } from 'react';
import { Users, Clock, CheckCircle, XCircle, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import TableBillingModal from './TableBillingModal';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: TableStatus;
  position: { x: number; y: number };
  currentBill?: {
    id: string;
    items: any[];
    total: number;
    startTime: string;
  };
  reservation?: {
    time: string;
    customerName: string;
  };
}

const FloorPlanScreen = () => {
  const { toast } = useToast();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [billingModalOpen, setBillingModalOpen] = useState(false);

  // Sample table data - in a real app this would come from a database
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, seats: 2, status: 'available', position: { x: 100, y: 100 } },
    { id: '2', number: 2, seats: 4, status: 'occupied', position: { x: 300, y: 100 }, 
      currentBill: { id: 'bill-1', items: [], total: 450, startTime: '2024-06-14T12:30:00' } },
    { id: '3', number: 3, seats: 6, status: 'reserved', position: { x: 500, y: 100 },
      reservation: { time: '19:00', customerName: 'Smith Family' } },
    { id: '4', number: 4, seats: 2, status: 'cleaning', position: { x: 100, y: 300 } },
    { id: '5', number: 5, seats: 4, status: 'available', position: { x: 300, y: 300 } },
    { id: '6', number: 6, seats: 8, status: 'occupied', position: { x: 500, y: 300 },
      currentBill: { id: 'bill-2', items: [], total: 280, startTime: '2024-06-14T13:15:00' } },
  ]);

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

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    if (table.status === 'occupied' || table.status === 'available') {
      setBillingModalOpen(true);
    }
  };

  const updateTableStatus = (tableId: string, newStatus: TableStatus) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status: newStatus } : table
    ));
    toast({
      title: "Table Status Updated",
      description: `Table ${tables.find(t => t.id === tableId)?.number} is now ${newStatus}`,
    });
  };

  const startBilling = (table: Table) => {
    if (table.status === 'available') {
      updateTableStatus(table.id, 'occupied');
    }
    setSelectedTable(table);
    setBillingModalOpen(true);
  };

  const getTableStats = () => {
    const available = tables.filter(t => t.status === 'available').length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const reserved = tables.filter(t => t.status === 'reserved').length;
    const cleaning = tables.filter(t => t.status === 'cleaning').length;
    
    return { available, occupied, reserved, cleaning, total: tables.length };
  };

  const stats = getTableStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Floor Plan Management</h1>
        <div className="flex gap-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Available: {stats.available}
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Occupied: {stats.occupied}
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Reserved: {stats.reserved}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Cleaning: {stats.cleaning}
          </Badge>
        </div>
      </div>

      {/* Floor Plan View */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Restaurant Floor Plan
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Layout
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg p-4 min-h-[500px] overflow-hidden">
            {/* Table Positions */}
            {tables.map((table) => (
              <div
                key={table.id}
                className={`absolute cursor-pointer transition-all duration-200 hover:scale-105 ${getStatusColor(table.status)} border-2 rounded-lg p-4 min-w-[120px] shadow-sm hover:shadow-md`}
                style={{
                  left: `${table.position.x}px`,
                  top: `${table.position.y}px`,
                }}
                onClick={() => handleTableClick(table)}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600">Available Tables</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
            <div className="text-sm text-gray-600">Occupied Tables</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.reserved}</div>
            <div className="text-sm text-gray-600">Reserved Tables</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ₹{tables.filter(t => t.currentBill).reduce((sum, t) => sum + (t.currentBill?.total || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Modal */}
      {selectedTable && (
        <TableBillingModal
          isOpen={billingModalOpen}
          onClose={() => {
            setBillingModalOpen(false);
            setSelectedTable(null);
          }}
          table={selectedTable}
          onUpdateTable={(updatedTable) => {
            setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
          }}
        />
      )}
    </div>
  );
};

export default FloorPlanScreen;
