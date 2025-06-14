
import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
}

const QuickAddModal = ({ isOpen, onClose, menuItems, onAddItem }: QuickAddModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.available
  ).slice(0, 6); // Show only top 6 results

  const handleAddItem = (item: MenuItem) => {
    onAddItem(item);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add Items</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          
          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {searchTerm ? 'No items found' : 'Start typing to search items'}
              </p>
            ) : (
              filteredItems.map(item => (
                <Card key={item.id} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">₹{item.price}</span>
                        <Button
                          size="sm"
                          onClick={() => handleAddItem(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddModal;
