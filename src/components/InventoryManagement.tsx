
import { useState } from 'react';
import { Package, AlertTriangle, Plus, Minus, Search, Filter, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
}

const mockInventoryData: InventoryItem[] = [
  {
    id: '1',
    name: 'Tomatoes',
    category: 'Vegetables',
    currentStock: 25,
    minStock: 50,
    unit: 'kg',
    costPerUnit: 3.50,
    supplier: 'Fresh Farm Co',
    lastRestocked: '2024-06-10',
    expiryDate: '2024-06-16'
  },
  {
    id: '2',
    name: 'Chicken Breast',
    category: 'Meat',
    currentStock: 15,
    minStock: 20,
    unit: 'kg',
    costPerUnit: 12.00,
    supplier: 'Premium Meats Ltd',
    lastRestocked: '2024-06-12',
    expiryDate: '2024-06-15'
  },
  {
    id: '3',
    name: 'Olive Oil',
    category: 'Condiments',
    currentStock: 8,
    minStock: 5,
    unit: 'L',
    costPerUnit: 8.50,
    supplier: 'Mediterranean Imports',
    lastRestocked: '2024-06-08'
  },
  {
    id: '4',
    name: 'Flour',
    category: 'Baking',
    currentStock: 2,
    minStock: 10,
    unit: 'kg',
    costPerUnit: 2.20,
    supplier: 'Bakery Supplies Inc',
    lastRestocked: '2024-06-05'
  }
];

const InventoryManagement = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))];

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock * 0.5) return 'critical';
    if (item.currentStock <= item.minStock) return 'low';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const updateStock = (itemId: string, change: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, currentStock: Math.max(0, item.currentStock + change) }
        : item
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your restaurant inventory</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${inventory.reduce((total, item) => total + (item.currentStock * item.costPerUnit), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length - 1}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search inventory items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage your restaurant's inventory stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInventory.map((item) => {
              const status = getStockStatus(item);
              return (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <Badge className={getStatusColor(status)}>
                          {status === 'critical' ? 'Critical' : status === 'low' ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.category} • {item.supplier}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>Current: {item.currentStock} {item.unit}</span>
                        <span>Min: {item.minStock} {item.unit}</span>
                        <span>${item.costPerUnit}/{item.unit}</span>
                        {item.expiryDate && (
                          <span className="text-orange-600">Expires: {item.expiryDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStock(item.id, -1)}
                      disabled={item.currentStock <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[3rem] text-center font-medium">
                      {item.currentStock}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStock(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new item to your inventory management system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Current Stock</Label>
              <Input id="stock" type="number" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddModalOpen(false)}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
