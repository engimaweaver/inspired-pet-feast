
import { useState } from 'react';
import { Plus, Store, MapPin, Edit, Trash2, MoreVertical, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Store {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
  revenue: number;
  orders: number;
}

// Mock data
const mockStores: Store[] = [
  {
    id: '1',
    name: 'Downtown Cafe',
    location: 'Main Street, Downtown',
    address: '123 Main St, Downtown, NY 10001',
    phone: '+1 (555) 123-4567',
    manager: 'Sarah Johnson',
    status: 'active',
    revenue: 12400,
    orders: 156
  },
  {
    id: '2',
    name: 'Mall Location',
    location: 'Shopping Center, North',
    address: '456 Mall Ave, North Plaza, NY 10002',
    phone: '+1 (555) 234-5678',
    manager: 'Mike Chen',
    status: 'active',
    revenue: 9800,
    orders: 134
  },
  {
    id: '3',
    name: 'Airport Branch',
    location: 'Terminal 2, Airport',
    address: 'Terminal 2, JFK Airport, NY 11430',
    phone: '+1 (555) 345-6789',
    manager: 'Lisa Rodriguez',
    status: 'active',
    revenue: 15600,
    orders: 189
  },
  {
    id: '4',
    name: 'University Campus',
    location: 'Campus Center',
    address: '789 University Blvd, Campus, NY 10003',
    phone: '+1 (555) 456-7890',
    manager: 'David Park',
    status: 'inactive',
    revenue: 6200,
    orders: 89
  }
];

const StoreManagement = () => {
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    manager: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddStore = () => {
    const newStore: Store = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      revenue: 0,
      orders: 0
    };
    setStores(prev => [...prev, newStore]);
    setFormData({ name: '', location: '', address: '', phone: '', manager: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      location: store.location,
      address: store.address,
      phone: store.phone,
      manager: store.manager
    });
  };

  const handleUpdateStore = () => {
    if (!editingStore) return;
    
    setStores(prev =>
      prev.map(store =>
        store.id === editingStore.id
          ? { ...store, ...formData }
          : store
      )
    );
    setEditingStore(null);
    setFormData({ name: '', location: '', address: '', phone: '', manager: '' });
  };

  const toggleStoreStatus = (storeId: string) => {
    setStores(prev =>
      prev.map(store =>
        store.id === storeId
          ? { ...store, status: store.status === 'active' ? 'inactive' : 'active' }
          : store
      )
    );
  };

  const StoreForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Store Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter store name"
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Enter location description"
        />
      </div>
      <div>
        <Label htmlFor="address">Full Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter full address"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <Label htmlFor="manager">Store Manager</Label>
        <Input
          id="manager"
          value={formData.manager}
          onChange={(e) => handleInputChange('manager', e.target.value)}
          placeholder="Enter manager name"
        />
      </div>
      <Button
        onClick={editingStore ? handleUpdateStore : handleAddStore}
        className="w-full"
      >
        {editingStore ? 'Update Store' : 'Add Store'}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant locations and performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Store</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>
                Add a new restaurant location to your chain
              </DialogDescription>
            </DialogHeader>
            <StoreForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  store.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Store className={`h-5 w-5 ${
                    store.status === 'active' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{store.name}</h3>
                  <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                    {store.status}
                  </Badge>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem onClick={() => handleEditStore(store)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Store
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleStoreStatus(store.id)}>
                    {store.status === 'active' ? (
                      <>
                        <PowerOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Store
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{store.location}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Manager:</strong> {store.manager}</p>
                <p><strong>Phone:</strong> {store.phone}</p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ${store.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{store.orders}</p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Store Dialog */}
      <Dialog open={!!editingStore} onOpenChange={() => setEditingStore(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>
              Update store information and details
            </DialogDescription>
          </DialogHeader>
          <StoreForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreManagement;
