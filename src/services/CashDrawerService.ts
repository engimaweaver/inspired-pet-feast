
export interface DrawerStatus {
  connected: boolean;
  open: boolean;
  error?: string;
}

class CashDrawerService {
  private serialPort: SerialPort | null = null;
  private isConnected = false;

  async connect(): Promise<boolean> {
    try {
      if (!navigator.serial) {
        throw new Error('Web Serial API not supported');
      }

      // Request serial port
      this.serialPort = await navigator.serial.requestPort();
      await this.serialPort.open({ baudRate: 9600 });
      this.isConnected = true;
      console.log('Cash drawer connected');
      return true;
    } catch (error) {
      console.error('Failed to connect to cash drawer:', error);
      return false;
    }
  }

  async openDrawer(): Promise<boolean> {
    if (!this.isConnected || !this.serialPort) {
      console.error('Cash drawer not connected');
      return false;
    }

    try {
      const writer = this.serialPort.writable?.getWriter();
      if (!writer) throw new Error('Serial port not writable');

      // ESC/POS command to open cash drawer
      const openCommand = new Uint8Array([0x1B, 0x70, 0x00, 0x19, 0xFA]);
      await writer.write(openCommand);
      writer.releaseLock();
      
      console.log('Cash drawer opened');
      return true;
    } catch (error) {
      console.error('Failed to open cash drawer:', error);
      return false;
    }
  }

  async getStatus(): Promise<DrawerStatus> {
    if (!this.isConnected) {
      return {
        connected: false,
        open: false,
        error: 'Cash drawer not connected'
      };
    }

    try {
      // In a real implementation, you'd read the drawer status
      // For now, we'll simulate the status
      return {
        connected: true,
        open: false // Would need actual hardware feedback
      };
    } catch (error) {
      return {
        connected: false,
        open: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  disconnect(): void {
    if (this.serialPort) {
      this.serialPort.close();
      this.serialPort = null;
      this.isConnected = false;
      console.log('Cash drawer disconnected');
    }
  }
}

export default new CashDrawerService();
