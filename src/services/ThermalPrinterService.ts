
export interface PrinterStatus {
  connected: boolean;
  paperStatus: 'ok' | 'low' | 'out';
  temperature: 'normal' | 'high';
  error?: string;
}

export interface PrintJob {
  id: string;
  type: 'receipt' | 'kitchen' | 'report';
  content: string;
  timestamp: Date;
  status: 'pending' | 'printing' | 'completed' | 'failed';
}

class ThermalPrinterService {
  private device: USBDevice | null = null;
  private isConnected = false;
  private printQueue: PrintJob[] = [];

  async connect(): Promise<boolean> {
    try {
      if (!navigator.usb) {
        throw new Error('WebUSB not supported');
      }

      const devices = await navigator.usb.getDevices();
      const printer = devices.find(device => 
        device.vendorId === 0x04b8 || // Epson
        device.vendorId === 0x0519    // Star Micronics
      );

      if (printer) {
        await printer.open();
        if (printer.configuration === null) {
          await printer.selectConfiguration(1);
        }
        await printer.claimInterface(0);
        this.device = printer;
        this.isConnected = true;
        console.log('Thermal printer connected');
        return true;
      }

      // Request device if none found
      this.device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x04b8 }, // Epson
          { vendorId: 0x0519 }  // Star Micronics
        ]
      });

      await this.device.open();
      if (this.device.configuration === null) {
        await this.device.selectConfiguration(1);
      }
      await this.device.claimInterface(0);
      this.isConnected = true;
      console.log('Thermal printer connected via request');
      return true;
    } catch (error) {
      console.error('Failed to connect to thermal printer:', error);
      return false;
    }
  }

  async getStatus(): Promise<PrinterStatus> {
    if (!this.isConnected || !this.device) {
      return {
        connected: false,
        paperStatus: 'out',
        temperature: 'normal',
        error: 'Printer not connected'
      };
    }

    try {
      // ESC/POS command to get printer status
      const statusCommand = new Uint8Array([0x10, 0x04, 0x01]);
      await this.device.transferOut(1, statusCommand);
      
      const result = await this.device.transferIn(1, 1);
      const status = new Uint8Array(result.data!.buffer)[0];

      return {
        connected: true,
        paperStatus: (status & 0x60) === 0 ? 'ok' : 'out',
        temperature: (status & 0x40) === 0 ? 'normal' : 'high',
      };
    } catch (error) {
      return {
        connected: false,
        paperStatus: 'out',
        temperature: 'normal',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async printReceipt(orderData: any): Promise<boolean> {
    const receiptContent = this.formatReceipt(orderData);
    return this.print(receiptContent, 'receipt');
  }

  async printKitchenOrder(orderData: any): Promise<boolean> {
    const kitchenContent = this.formatKitchenOrder(orderData);
    return this.print(kitchenContent, 'kitchen');
  }

  private async print(content: string, type: PrintJob['type']): Promise<boolean> {
    const job: PrintJob = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      status: 'pending'
    };

    this.printQueue.push(job);
    return this.processPrintJob(job);
  }

  private async processPrintJob(job: PrintJob): Promise<boolean> {
    if (!this.isConnected || !this.device) {
      job.status = 'failed';
      return false;
    }

    try {
      job.status = 'printing';
      
      // ESC/POS commands for receipt formatting
      const commands = [
        0x1B, 0x40, // Initialize printer
        ...new TextEncoder().encode(job.content),
        0x1B, 0x64, 0x03, // Feed 3 lines
        0x1D, 0x56, 0x00  // Cut paper
      ];

      await this.device.transferOut(1, new Uint8Array(commands));
      job.status = 'completed';
      console.log('Print job completed:', job.id);
      return true;
    } catch (error) {
      job.status = 'failed';
      console.error('Print job failed:', error);
      return false;
    }
  }

  private formatReceipt(orderData: any): string {
    const { orderItems, total, tax, customerInfo } = orderData;
    let receipt = '';
    
    receipt += '================================\n';
    receipt += '        RESTAURANT NAME         \n';
    receipt += '================================\n';
    receipt += `Date: ${new Date().toLocaleDateString()}\n`;
    receipt += `Time: ${new Date().toLocaleTimeString()}\n`;
    receipt += `Order #: ${orderData.orderNumber || 'N/A'}\n`;
    receipt += '--------------------------------\n';
    
    orderItems.forEach((item: any) => {
      receipt += `${item.name}\n`;
      receipt += `  ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}\n`;
    });
    
    receipt += '--------------------------------\n';
    receipt += `Subtotal: ₹${total - tax}\n`;
    receipt += `Tax (18%): ₹${tax}\n`;
    receipt += `Total: ₹${total}\n`;
    receipt += '================================\n';
    receipt += '     Thank you for visiting!    \n';
    receipt += '================================\n';
    
    return receipt;
  }

  private formatKitchenOrder(orderData: any): string {
    const { orderItems, tableNumber, orderTime } = orderData;
    let kitchenOrder = '';
    
    kitchenOrder += '*** KITCHEN ORDER ***\n';
    kitchenOrder += `Table: ${tableNumber || 'Takeout'}\n`;
    kitchenOrder += `Time: ${orderTime || new Date().toLocaleTimeString()}\n`;
    kitchenOrder += '---------------------\n';
    
    orderItems.forEach((item: any) => {
      kitchenOrder += `${item.quantity}x ${item.name}\n`;
      if (item.specialInstructions) {
        kitchenOrder += `  * ${item.specialInstructions}\n`;
      }
    });
    
    kitchenOrder += '---------------------\n';
    
    return kitchenOrder;
  }

  disconnect(): void {
    if (this.device) {
      this.device.close();
      this.device = null;
      this.isConnected = false;
      console.log('Thermal printer disconnected');
    }
  }
}

export default new ThermalPrinterService();
