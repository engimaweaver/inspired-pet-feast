
import { useState } from 'react';
import { ChevronDown, Store, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Store {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
}

// Mock data - will be replaced with real data from backend
const mockStores: Store[] = [
  { id: '1', name: 'Downtown Cafe', location: 'Main Street, Downtown', status: 'active' },
  { id: '2', name: 'Mall Location', location: 'Shopping Center, North', status: 'active' },
  { id: '3', name: 'Airport Branch', location: 'Terminal 2, Airport', status: 'active' },
  { id: '4', name: 'University Campus', location: 'Campus Center', status: 'inactive' },
];

interface StoreSelectorProps {
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
  showAllStores?: boolean;
}

const StoreSelector = ({ selectedStore, onStoreSelect, showAllStores = false }: StoreSelectorProps) => {
  const handleAllStoresSelect = () => {
    onStoreSelect({ id: 'all', name: 'All Stores', location: 'Chain-wide view', status: 'active' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between min-w-[200px]">
          <div className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">{selectedStore?.name || 'Select Store'}</div>
              {selectedStore && (
                <div className="text-xs text-gray-500">{selectedStore.location}</div>
              )}
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        {showAllStores && (
          <DropdownMenuItem onClick={handleAllStoresSelect} className="cursor-pointer">
            <div className="flex items-center space-x-2 w-full">
              <Store className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium">All Stores</div>
                <div className="text-xs text-gray-500">Chain-wide view</div>
              </div>
            </div>
          </DropdownMenuItem>
        )}
        {mockStores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => onStoreSelect(store)}
            className="cursor-pointer"
          >
            <div className="flex items-center space-x-2 w-full">
              <MapPin className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <div className="font-medium">{store.name}</div>
                <div className="text-xs text-gray-500">{store.location}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                store.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StoreSelector;
