
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAddToOrder }: MenuItemCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.category}</p>
          </div>
          <span className="font-bold text-green-600">₹{item.price}</span>
        </div>
        <Button 
          onClick={() => onAddToOrder(item)}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add to Order
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
