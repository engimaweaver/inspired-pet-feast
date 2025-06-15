
import { useState } from 'react';
import { Plus, X, Copy, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBillManager } from './BillManager';
import { useToast } from '@/hooks/use-toast';

const BillTabs = () => {
  const { 
    bills, 
    activeBillId, 
    createNewBill, 
    switchToBill, 
    deleteBill, 
    setBillStatus, 
    duplicateBill 
  } = useBillManager();
  const [newBillDialogOpen, setNewBillDialogOpen] = useState(false);
  const [billType, setBillType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [customName, setCustomName] = useState('');
  const { toast } = useToast();

  const handleCreateBill = () => {
    const billId = createNewBill(billType, customName || undefined);
    setNewBillDialogOpen(false);
    setCustomName('');
    toast({
      title: "New Bill Created",
      description: `${billType} bill created successfully`,
    });
  };

  const handleDeleteBill = (billId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBill(billId);
    toast({
      title: "Bill Deleted",
      description: "Bill has been removed",
    });
  };

  const handleDuplicateBill = (billId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateBill(billId);
    toast({
      title: "Bill Duplicated",
      description: "Bill has been copied",
    });
  };

  const handleToggleHold = (billId: string, currentStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'on-hold' ? 'active' : 'on-hold';
    setBillStatus(billId, newStatus);
    toast({
      title: newStatus === 'on-hold' ? "Bill On Hold" : "Bill Resumed",
      description: `Bill is now ${newStatus === 'on-hold' ? 'on hold' : 'active'}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b overflow-x-auto">
      <div className="flex gap-2 min-w-0">
        {bills.map(bill => (
          <div
            key={bill.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors min-w-0 ${
              activeBillId === bill.id 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => switchToBill(bill.id)}
          >
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{bill.name}</span>
              <div className="flex items-center gap-1">
                <Badge className={`text-xs ${getStatusColor(bill.status)}`}>
                  {bill.status}
                </Badge>
                <span className="text-xs text-gray-500">
                  {bill.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleToggleHold(bill.id, bill.status, e)}
                className="h-6 w-6 p-0"
              >
                {bill.status === 'on-hold' ? 
                  <Play className="h-3 w-3" /> : 
                  <Pause className="h-3 w-3" />
                }
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleDuplicateBill(bill.id, e)}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleDeleteBill(bill.id, e)}
                className="h-6 w-6 p-0 text-red-500"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={newBillDialogOpen} onOpenChange={setNewBillDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="shrink-0">
            <Plus className="h-4 w-4 mr-1" />
            New Bill
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Bill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="billType">Bill Type</Label>
              <Select value={billType} onValueChange={(value: any) => setBillType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dine-in">Dine In</SelectItem>
                  <SelectItem value="takeaway">Takeaway</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customName">Custom Name (Optional)</Label>
              <Input
                id="customName"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter custom bill name"
              />
            </div>
            <Button onClick={handleCreateBill} className="w-full">
              Create Bill
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillTabs;
