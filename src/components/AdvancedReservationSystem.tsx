
import { useState } from 'react';
import { Calendar, Clock, Users, Phone, Mail, MapPin, AlertCircle, CheckCircle, X, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'pending' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  tableNumber?: string;
  specialRequests?: string;
  estimatedWaitTime?: number;
  queuePosition?: number;
}

interface WalkInCustomer {
  id: string;
  name: string;
  phone?: string;
  partySize: number;
  arrivalTime: string;
  estimatedWaitTime: number;
  queuePosition: number;
  status: 'waiting' | 'called' | 'seated' | 'left';
}

const mockReservations: Reservation[] = [
  {
    id: '1',
    customerName: 'John Smith',
    email: 'john@email.com',
    phone: '+1 555-0123',
    date: '2024-06-14',
    time: '19:00',
    partySize: 4,
    status: 'confirmed',
    tableNumber: 'T-12',
    specialRequests: 'Anniversary dinner, prefer quiet table'
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '+1 555-0124',
    date: '2024-06-14',
    time: '19:30',
    partySize: 2,
    status: 'pending'
  },
  {
    id: '3',
    customerName: 'Mike Chen',
    email: 'mike@email.com',
    phone: '+1 555-0125',
    date: '2024-06-14',
    time: '20:00',
    partySize: 6,
    status: 'confirmed',
    tableNumber: 'T-15'
  }
];

const mockWalkIns: WalkInCustomer[] = [
  {
    id: 'w1',
    name: 'David Wilson',
    phone: '+1 555-0126',
    partySize: 3,
    arrivalTime: '18:45',
    estimatedWaitTime: 15,
    queuePosition: 1,
    status: 'waiting'
  },
  {
    id: 'w2',
    name: 'Lisa Brown',
    partySize: 2,
    arrivalTime: '19:10',
    estimatedWaitTime: 25,
    queuePosition: 2,
    status: 'waiting'
  }
];

const AdvancedReservationSystem = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [walkIns, setWalkIns] = useState<WalkInCustomer[]>(mockWalkIns);
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);
  const [isAddWalkInOpen, setIsAddWalkInOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [reservationForm, setReservationForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    partySize: 2,
    specialRequests: ''
  });

  const [walkInForm, setWalkInForm] = useState({
    name: '',
    phone: '',
    partySize: 2
  });

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'seated': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === id ? { ...reservation, status } : reservation
    ));
  };

  const updateWalkInStatus = (id: string, status: WalkInCustomer['status']) => {
    setWalkIns(prev => prev.map(walkIn => 
      walkIn.id === id ? { ...walkIn, status } : walkIn
    ));
  };

  const addReservation = () => {
    const newReservation: Reservation = {
      id: Date.now().toString(),
      ...reservationForm,
      status: 'pending'
    };
    setReservations(prev => [...prev, newReservation]);
    setReservationForm({
      customerName: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      partySize: 2,
      specialRequests: ''
    });
    setIsAddReservationOpen(false);
  };

  const addWalkIn = () => {
    const newWalkIn: WalkInCustomer = {
      id: Date.now().toString(),
      ...walkInForm,
      arrivalTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      estimatedWaitTime: 20 + (walkIns.length * 10),
      queuePosition: walkIns.length + 1,
      status: 'waiting'
    };
    setWalkIns(prev => [...prev, newWalkIn]);
    setWalkInForm({
      name: '',
      phone: '',
      partySize: 2
    });
    setIsAddWalkInOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Reservations & Queue</h1>
          <p className="text-gray-600">Manage reservations and walk-in queue efficiently</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddWalkInOpen} onOpenChange={setIsAddWalkInOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Walk-in
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Walk-in Customer</DialogTitle>
                <DialogDescription>Add a customer to the waiting queue</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="walkInName">Customer Name</Label>
                  <Input
                    id="walkInName"
                    value={walkInForm.name}
                    onChange={(e) => setWalkInForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="walkInPhone">Phone (Optional)</Label>
                  <Input
                    id="walkInPhone"
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="walkInPartySize">Party Size</Label>
                  <Select value={walkInForm.partySize.toString()} onValueChange={(value) => setWalkInForm(prev => ({ ...prev, partySize: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(size => (
                        <SelectItem key={size} value={size.toString()}>{size} {size === 1 ? 'person' : 'people'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addWalkIn}>Add to Queue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddReservationOpen} onOpenChange={setIsAddReservationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Reservation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Reservation</DialogTitle>
                <DialogDescription>Create a new table reservation</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={reservationForm.customerName}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={reservationForm.email}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={reservationForm.phone}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={reservationForm.date}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={reservationForm.time}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partySize">Party Size</Label>
                    <Select value={reservationForm.partySize.toString()} onValueChange={(value) => setReservationForm(prev => ({ ...prev, partySize: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(size => (
                          <SelectItem key={size} value={size.toString()}>{size} {size === 1 ? 'person' : 'people'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={reservationForm.specialRequests}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addReservation}>Create Reservation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Walk-in Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Walk-in Queue ({walkIns.filter(w => w.status === 'waiting').length} waiting)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {walkIns.filter(w => w.status === 'waiting').map((walkIn) => (
              <div key={walkIn.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">#{walkIn.queuePosition}</Badge>
                  <div>
                    <h4 className="font-medium">{walkIn.name}</h4>
                    <p className="text-sm text-gray-600">
                      {walkIn.partySize} people • Arrived: {walkIn.arrivalTime}
                      {walkIn.phone && ` • ${walkIn.phone}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">~{walkIn.estimatedWaitTime} min</p>
                    <p className="text-xs text-gray-500">Est. wait</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => updateWalkInStatus(walkIn.id, 'called')}
                  >
                    Call Customer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateWalkInStatus(walkIn.id, 'seated')}
                  >
                    Seat Now
                  </Button>
                </div>
              </div>
            ))}
            {walkIns.filter(w => w.status === 'waiting').length === 0 && (
              <p className="text-center text-gray-500 py-8">No customers in queue</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Reservations</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search reservations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="seated">Seated</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <div key={reservation.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{reservation.customerName}</h3>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                      {reservation.tableNumber && (
                        <Badge variant="outline">{reservation.tableNumber}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {reservation.date} at {reservation.time}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {reservation.partySize} people
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {reservation.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {reservation.email}
                      </div>
                    </div>
                    {reservation.specialRequests && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {reservation.specialRequests}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {reservation.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    {reservation.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, 'seated')}
                      >
                        Seat
                      </Button>
                    )}
                    {reservation.status === 'seated' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReservationStatus(reservation.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedReservationSystem;
