
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Star } from 'lucide-react';
import DataTable from './shared/DataTable';

const menuItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: '$18.00',
    description: 'Fresh mozzarella, tomato sauce, basil leaves',
    image: '/placeholder.svg',
    rating: 4.8,
    status: 'available',
    sales: 145
  },
  {
    id: 2,
    name: 'Grilled Salmon',
    category: 'Seafood',
    price: '$32.00',
    description: 'Atlantic salmon with lemon butter sauce',
    image: '/placeholder.svg',
    rating: 4.9,
    status: 'available',
    sales: 89
  },
  {
    id: 3,
    name: 'Caesar Salad',
    category: 'Salads',
    price: '$14.00',
    description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
    image: '/placeholder.svg',
    rating: 4.6,
    status: 'unavailable',
    sales: 67
  },
  {
    id: 4,
    name: 'Chicken Burger',
    category: 'Burgers',
    price: '$16.50',
    description: 'Grilled chicken breast, lettuce, tomato, mayo',
    image: '/placeholder.svg',
    rating: 4.7,
    status: 'available',
    sales: 123
  },
];

const categories = ['All', 'Pizza', 'Burgers', 'Salads', 'Seafood', 'Desserts'];

const MenuManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant's menu items and categories</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-blue-600' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {item.status}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className="font-bold text-blue-600">{item.price}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.sales} sold</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
