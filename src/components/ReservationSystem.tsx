
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Phone, Mail, Plus, Search, Filter } from 'lucide-react';

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'pending' | 'seated' | 'completed' | 'cancelled';
  specialRequests?: string;
  tableNumber?: number;
}

interface QueueItem {
  id: string;
  customerName: string;
  partySize: number;
  arrivalTime: string;
  estimatedWait: number;
  phone: string;
  status: 'waiting' | 'notified' | 'seated';
}

const mockReservations: Reservation[] = [
  {
    id: '1',
    customerName: 'John Smith',
    email: 'john@email.com',
    phone: '+1-555-0101',
    date: '2024-06-15',
    time: '19:00',
    partySize: 4,
    status: 'confirmed',
    specialRequests: 'Window table preferred'
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '+1-555-0102',
    date: '2024-06-15',
    time: '20:30',
    partySize: 2,
    status: 'pending'
  },
  {
    id: '3',
    customerName: 'Mike Brown',
    email: 'mike@email.com',
    phone: '+1-555-0103',
    date: '2024-06-15',
    time: '18:00',
    partySize: 6,
    status: 'seated',
    tableNumber: 12
  }
];

const mockQueue: QueueItem[] = [
  {
    id: '1',
    customerName: 'Emma Wilson',
    partySize: 3,
    arrivalTime: '18:45',
    estimatedWait: 15,
    phone: '+1-555-0201',
    status: 'waiting'
  },
  {
    id: '2',
    customerName: 'David Lee',
    partySize: 2,
    arrivalTime: '19:10',
    estimatedWait: 25,
    phone: '+1-555-0202',
    status: 'notified'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'seated': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'waiting': return 'bg-orange-100 text-orange-800';
    case 'notified': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ReservationSystem = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [queue, setQueue] = useState<QueueItem[]>(mockQueue);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReservations = reservations.filter(res =>
    res.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.phone.includes(searchTerm)
  );

  const handleStatusChange = (id: string, newStatus: Reservation['status']) => {
    setReservations(prev =>
      prev.map(res => res.id === id ? { ...res, status: newStatus } : res)
    );
  };

  const handleSeatQueue = (id: string, tableNumber: number) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    // Add logic to move to reservations or update table status
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservation & Queue Management</h1>
          <p className="text-gray-600 mt-1">Manage reservations and walk-in queue efficiently</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Reservation
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Tabs defaultValue="reservations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Reservations ({reservations.length})
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Walk-in Queue ({queue.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="p-6 space-y-4">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reservations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{reservation.customerName}</h3>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {reservation.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reservation.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {reservation.partySize} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {reservation.phone}
                          </span>
                        </div>
                        {reservation.specialRequests && (
                          <p className="text-sm text-gray-500">Note: {reservation.specialRequests}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {reservation.status === 'pending' && (
                          <Button size="sm" onClick={() => handleStatusChange(reservation.id, 'confirmed')}>
                            Confirm
                          </Button>
                        )}
                        {reservation.status === 'confirmed' && (
                          <Button size="sm" onClick={() => handleStatusChange(reservation.id, 'seated')}>
                            Seat
                          </Button>
                        )}
                        {reservation.status === 'seated' && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(reservation.id, 'completed')}>
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="queue" className="p-6 space-y-4">
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Current Wait Time: 20-25 minutes</h3>
              <p className="text-sm text-gray-600">Next available table for 2: Table 5 (8 mins)</p>
            </div>

            <div className="space-y-4">
              {queue.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{item.customerName}</h3>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Arrived: {item.arrivalTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {item.partySize} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {item.phone}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-blue-600">
                          Estimated wait: {item.estimatedWait} minutes
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {item.status === 'waiting' && (
                          <Button size="sm" variant="outline">
                            Notify
                          </Button>
                        )}
                        <Button size="sm" onClick={() => handleSeatQueue(item.id, 5)}>
                          Seat Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {queue.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No customers in queue</h3>
                <p className="text-gray-600">All customers have been seated!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReservationSystem;
