
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { downloadCSV, downloadExcel, exportRevenueData, exportExpenseData, exportProfitMarginData } from '@/utils/exportUtils';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  revenueData: any[];
  expenseData: any[];
  profitMarginData: any[];
}

const ExportDialog = ({ isOpen, onClose, revenueData, expenseData, profitMarginData }: ExportDialogProps) => {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>(['revenue']);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');

  const handleDatasetChange = (dataset: string, checked: boolean) => {
    if (checked) {
      setSelectedDatasets(prev => [...prev, dataset]);
    } else {
      setSelectedDatasets(prev => prev.filter(d => d !== dataset));
    }
  };

  const handleExport = () => {
    const exportFunction = exportFormat === 'csv' ? downloadCSV : downloadExcel;
    
    selectedDatasets.forEach(dataset => {
      switch (dataset) {
        case 'revenue':
          exportFunction(exportRevenueData(revenueData));
          break;
        case 'expenses':
          exportFunction(exportExpenseData(expenseData));
          break;
        case 'margins':
          exportFunction(exportProfitMarginData(profitMarginData));
          break;
      }
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Data</span>
          </DialogTitle>
          <DialogDescription>
            Select the data you want to export and choose your preferred format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Select Data to Export</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="revenue"
                  checked={selectedDatasets.includes('revenue')}
                  onCheckedChange={(checked) => handleDatasetChange('revenue', checked as boolean)}
                />
                <Label htmlFor="revenue" className="text-sm">Revenue & Profit Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="expenses"
                  checked={selectedDatasets.includes('expenses')}
                  onCheckedChange={(checked) => handleDatasetChange('expenses', checked as boolean)}
                />
                <Label htmlFor="expenses" className="text-sm">Expense Breakdown</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="margins"
                  checked={selectedDatasets.includes('margins')}
                  onCheckedChange={(checked) => handleDatasetChange('margins', checked as boolean)}
                />
                <Label htmlFor="margins" className="text-sm">Item Profit Margins</Label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Export Format</h4>
            <RadioGroup value={exportFormat} onValueChange={(value) => setExportFormat(value as 'csv' | 'excel')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <span>CSV (Comma Separated Values)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center space-x-2 text-sm">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Excel (XLSX)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={selectedDatasets.length === 0}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export {selectedDatasets.length} Dataset{selectedDatasets.length !== 1 ? 's' : ''}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
