
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Printer, 
  ScanBarcode, 
  DollarSign, 
  Monitor, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';
import ThermalPrinterService, { PrinterStatus } from '../services/ThermalPrinterService';
import BarcodeScannerService, { ScannerStatus } from '../services/BarcodeScannerService';
import CashDrawerService, { DrawerStatus } from '../services/CashDrawerService';
import KitchenDisplayHardwareService, { DisplayStatus } from '../services/KitchenDisplayHardwareService';
import { useToast } from '@/hooks/use-toast';

const HardwareIntegrationPanel = () => {
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus>({ 
    connected: false, 
    paperStatus: 'out', 
    temperature: 'normal' 
  });
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus>({ 
    connected: false, 
    scanning: false 
  });
  const [drawerStatus, setDrawerStatus] = useState<DrawerStatus>({ 
    connected: false, 
    open: false 
  });
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>({ 
    connected: false, 
    brightness: 0, 
    temperature: 0 
  });
  const { toast } = useToast();

  useEffect(() => {
    checkAllHardwareStatus();
    
    // Setup barcode scanner callback
    BarcodeScannerService.onScan((result) => {
      toast({
        title: "Barcode Scanned",
        description: `${result.barcode} (${result.format})`,
      });
    });

    const interval = setInterval(checkAllHardwareStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [toast]);

  const checkAllHardwareStatus = async () => {
    try {
      const [printer, scanner, drawer, display] = await Promise.all([
        ThermalPrinterService.getStatus(),
        BarcodeScannerService.getStatus(),
        CashDrawerService.getStatus(),
        KitchenDisplayHardwareService.getStatus()
      ]);

      setPrinterStatus(printer);
      setScannerStatus(scanner);
      setDrawerStatus(drawer);
      setDisplayStatus(display);
    } catch (error) {
      console.error('Failed to check hardware status:', error);
    }
  };

  const connectPrinter = async () => {
    const connected = await ThermalPrinterService.connect();
    if (connected) {
      toast({
        title: "Printer Connected",
        description: "Thermal printer is now ready",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Could not connect to thermal printer",
        variant: "destructive",
      });
    }
    checkAllHardwareStatus();
  };

  const connectScanner = async () => {
    const connected = await BarcodeScannerService.connect();
    if (connected) {
      BarcodeScannerService.startScanning();
      toast({
        title: "Scanner Connected",
        description: "Barcode scanner is now active",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Could not connect to barcode scanner",
        variant: "destructive",
      });
    }
    checkAllHardwareStatus();
  };

  const connectDrawer = async () => {
    const connected = await CashDrawerService.connect();
    if (connected) {
      toast({
        title: "Cash Drawer Connected",
        description: "Cash drawer is now ready",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Could not connect to cash drawer",
        variant: "destructive",
      });
    }
    checkAllHardwareStatus();
  };

  const connectDisplay = async () => {
    const connected = await KitchenDisplayHardwareService.connect();
    if (connected) {
      toast({
        title: "Kitchen Display Connected",
        description: "Kitchen display is now ready",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Could not connect to kitchen display",
        variant: "destructive",
      });
    }
    checkAllHardwareStatus();
  };

  const testPrinter = async () => {
    const success = await ThermalPrinterService.printReceipt({
      orderNumber: 'TEST-001',
      orderItems: [
        { name: 'Test Item', quantity: 1, price: 10 }
      ],
      total: 12,
      tax: 2
    });
    
    toast({
      title: success ? "Test Print Successful" : "Test Print Failed",
      description: success ? "Check your printer for the test receipt" : "Could not print test receipt",
      variant: success ? "default" : "destructive",
    });
  };

  const openCashDrawer = async () => {
    const success = await CashDrawerService.openDrawer();
    toast({
      title: success ? "Cash Drawer Opened" : "Failed to Open Drawer",
      description: success ? "Cash drawer has been opened" : "Could not open cash drawer",
      variant: success ? "default" : "destructive",
    });
  };

  const HardwareCard = ({ 
    title, 
    description, 
    icon: Icon, 
    connected, 
    error, 
    onConnect, 
    onTest, 
    testLabel = "Test",
    additionalInfo 
  }: {
    title: string;
    description: string;
    icon: any;
    connected: boolean;
    error?: string;
    onConnect: () => void;
    onTest?: () => void;
    testLabel?: string;
    additionalInfo?: React.ReactNode;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
          {connected ? (
            <Badge variant="default" className="ml-auto bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive" className="ml-auto">
              <WifiOff className="h-3 w-3 mr-1" />
              Disconnected
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {additionalInfo}
        
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={onConnect} 
            variant={connected ? "outline" : "default"}
            className="flex-1"
          >
            <Wifi className="h-4 w-4 mr-2" />
            {connected ? "Reconnect" : "Connect"}
          </Button>
          {onTest && connected && (
            <Button onClick={onTest} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              {testLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Hardware Integration</h2>
        <p className="text-gray-600">Manage and monitor connected POS hardware devices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HardwareCard
          title="Thermal Printer"
          description="Print receipts and kitchen orders"
          icon={Printer}
          connected={printerStatus.connected}
          error={printerStatus.error}
          onConnect={connectPrinter}
          onTest={testPrinter}
          testLabel="Test Print"
          additionalInfo={
            printerStatus.connected && (
              <div className="text-sm text-gray-600">
                <div>Paper: {printerStatus.paperStatus}</div>
                <div>Temperature: {printerStatus.temperature}</div>
              </div>
            )
          }
        />

        <HardwareCard
          title="Barcode Scanner"
          description="Scan product barcodes for quick adding"
          icon={ScanBarcode}
          connected={scannerStatus.connected}
          error={scannerStatus.error}
          onConnect={connectScanner}
          additionalInfo={
            scannerStatus.connected && (
              <div className="text-sm text-gray-600">
                <div>Status: {scannerStatus.scanning ? 'Scanning' : 'Ready'}</div>
              </div>
            )
          }
        />

        <HardwareCard
          title="Cash Drawer"
          description="Automatically open cash drawer"
          icon={DollarSign}
          connected={drawerStatus.connected}
          error={drawerStatus.error}
          onConnect={connectDrawer}
          onTest={openCashDrawer}
          testLabel="Open Drawer"
        />

        <HardwareCard
          title="Kitchen Display"
          description="Send orders to kitchen display system"
          icon={Monitor}
          connected={displayStatus.connected}
          error={displayStatus.error}
          onConnect={connectDisplay}
          additionalInfo={
            displayStatus.connected && (
              <div className="text-sm text-gray-600">
                <div>Brightness: {displayStatus.brightness}%</div>
                <div>Temperature: {displayStatus.temperature}°C</div>
              </div>
            )
          }
        />
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Hardware integration requires WebUSB, WebHID, and Web Serial API support. 
          Make sure your browser supports these features and you're using HTTPS.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default HardwareIntegrationPanel;
