
export interface ScanResult {
  barcode: string;
  format: string;
  timestamp: Date;
}

export interface ScannerStatus {
  connected: boolean;
  scanning: boolean;
  error?: string;
}

class BarcodeScannerService {
  private device: HIDDevice | null = null;
  private isConnected = false;
  private isScanning = false;
  private scanBuffer = '';
  private onScanCallback?: (result: ScanResult) => void;

  async connect(): Promise<boolean> {
    try {
      if (!navigator.hid) {
        throw new Error('WebHID not supported');
      }

      const devices = await navigator.hid.getDevices();
      const scanner = devices.find(device => 
        device.vendorId === 0x05e0 || // Symbol/Zebra
        device.vendorId === 0x0c2e    // Honeywell
      );

      if (scanner) {
        await scanner.open();
        this.device = scanner;
        this.isConnected = true;
        this.startListening();
        console.log('Barcode scanner connected');
        return true;
      }

      // Request device if none found
      this.device = await navigator.hid.requestDevice({
        filters: [
          { vendorId: 0x05e0 }, // Symbol/Zebra
          { vendorId: 0x0c2e }  // Honeywell
        ]
      });

      await this.device.open();
      this.isConnected = true;
      this.startListening();
      console.log('Barcode scanner connected via request');
      return true;
    } catch (error) {
      console.error('Failed to connect to barcode scanner:', error);
      return false;
    }
  }

  private startListening(): void {
    if (!this.device) return;

    this.device.addEventListener('inputreport', (event) => {
      this.handleScanData(event);
    });
  }

  private handleScanData(event: HIDInputReportEvent): void {
    const data = new Uint8Array(event.data.buffer);
    
    // Parse HID keyboard data
    for (let i = 2; i < data.length; i++) {
      const keyCode = data[i];
      if (keyCode === 0) continue;
      
      if (keyCode === 0x28) { // Enter key - end of barcode
        this.processScan();
        return;
      }
      
      // Convert HID key code to character
      const char = this.hidKeyToChar(keyCode);
      if (char) {
        this.scanBuffer += char;
      }
    }
  }

  private hidKeyToChar(keyCode: number): string | null {
    // HID to ASCII mapping for common characters
    const keyMap: { [key: number]: string } = {
      0x04: 'a', 0x05: 'b', 0x06: 'c', 0x07: 'd', 0x08: 'e', 0x09: 'f',
      0x0A: 'g', 0x0B: 'h', 0x0C: 'i', 0x0D: 'j', 0x0E: 'k', 0x0F: 'l',
      0x10: 'm', 0x11: 'n', 0x12: 'o', 0x13: 'p', 0x14: 'q', 0x15: 'r',
      0x16: 's', 0x17: 't', 0x18: 'u', 0x19: 'v', 0x1A: 'w', 0x1B: 'x',
      0x1C: 'y', 0x1D: 'z', 0x1E: '1', 0x1F: '2', 0x20: '3', 0x21: '4',
      0x22: '5', 0x23: '6', 0x24: '7', 0x25: '8', 0x26: '9', 0x27: '0'
    };
    
    return keyMap[keyCode] || null;
  }

  private processScan(): void {
    if (this.scanBuffer.length === 0) return;
    
    const result: ScanResult = {
      barcode: this.scanBuffer,
      format: this.detectBarcodeFormat(this.scanBuffer),
      timestamp: new Date()
    };
    
    console.log('Barcode scanned:', result);
    
    if (this.onScanCallback) {
      this.onScanCallback(result);
    }
    
    this.scanBuffer = '';
  }

  private detectBarcodeFormat(barcode: string): string {
    if (/^\d{13}$/.test(barcode)) return 'EAN-13';
    if (/^\d{12}$/.test(barcode)) return 'UPC-A';
    if (/^\d{8}$/.test(barcode)) return 'EAN-8';
    if (/^[0-9A-Z\-. $\/+%]+$/.test(barcode)) return 'Code 39';
    return 'Unknown';
  }

  onScan(callback: (result: ScanResult) => void): void {
    this.onScanCallback = callback;
  }

  startScanning(): boolean {
    if (!this.isConnected) return false;
    this.isScanning = true;
    console.log('Barcode scanning started');
    return true;
  }

  stopScanning(): void {
    this.isScanning = false;
    console.log('Barcode scanning stopped');
  }

  getStatus(): ScannerStatus {
    return {
      connected: this.isConnected,
      scanning: this.isScanning,
      error: !this.isConnected ? 'Scanner not connected' : undefined
    };
  }

  disconnect(): void {
    if (this.device) {
      this.device.close();
      this.device = null;
      this.isConnected = false;
      this.isScanning = false;
      console.log('Barcode scanner disconnected');
    }
  }
}

export default new BarcodeScannerService();
