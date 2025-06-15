
import { useState } from 'react';
import { Search, Barcode, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface SearchAndControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  menuItems: MenuItem[];
  onAddToOrder: (item: MenuItem) => void;
  onQuickAddClick: () => void;
}

const SearchAndControls = ({ 
  searchTerm, 
  onSearchChange, 
  menuItems, 
  onAddToOrder, 
  onQuickAddClick 
}: SearchAndControlsProps) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const { toast } = useToast();

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    
    const foundItem = menuItems.find(item => item.id === barcodeInput);
    if (foundItem) {
      onAddToOrder(foundItem);
      setBarcodeInput('');
      toast({
        title: "Item Found",
        description: `${foundItem.name} added via barcode scan`,
      });
    } else {
      toast({
        title: "Item Not Found",
        description: "Barcode not recognized",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
        <Input
          placeholder="Scan barcode..."
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          className="w-40"
        />
        <Button type="submit" variant="outline">
          <Barcode className="h-4 w-4" />
        </Button>
      </form>
      <Button
        onClick={onQuickAddClick}
        variant="outline"
        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
      >
        <Zap className="h-4 w-4 mr-2" />
        Quick Add
      </Button>
    </div>
  );
};

export default SearchAndControls;
