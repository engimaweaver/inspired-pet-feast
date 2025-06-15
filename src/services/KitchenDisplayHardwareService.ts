
export interface DisplayStatus {
  connected: boolean;
  brightness: number;
  temperature: number;
  error?: string;
}

export interface OrderDisplay {
  orderId: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

class KitchenDisplayHardwareService {
  private device: USBDevice | null = null;
  private isConnected = false;
  private displayQueue: OrderDisplay[] = [];

  async connect(): Promise<boolean> {
    try {
      if (!navigator.usb) {
        throw new Error('WebUSB not supported');
      }

      const devices = await navigator.usb.getDevices();
      const display = devices.find(device => 
        device.vendorId === 0x1a86 || // Common display controller
        device.vendorId === 0x0403    // FTDI USB-Serial
      );

      if (display) {
        await display.open();
        if (display.configuration === null) {
          await display.selectConfiguration(1);
        }
        await display.claimInterface(0);
        this.device = display;
        this.isConnected = true;
        console.log('Kitchen display connected');
        return true;
      }

      // Request device if none found
      this.device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x1a86 },
          { vendorId: 0x0403 }
        ]
      });

      await this.device.open();
      if (this.device.configuration === null) {
        await this.device.selectConfiguration(1);
      }
      await this.device.claimInterface(0);
      this.isConnected = true;
      console.log('Kitchen display connected via request');
      return true;
    } catch (error) {
      console.error('Failed to connect to kitchen display:', error);
      return false;
    }
  }

  async displayOrder(orderData: any): Promise<boolean> {
    if (!this.isConnected || !this.device) {
      console.error('Kitchen display not connected');
      return false;
    }

    try {
      const orderDisplay: OrderDisplay = {
        orderId: orderData.id || Date.now().toString(),
        content: this.formatOrderForDisplay(orderData),
        priority: this.calculatePriority(orderData),
        timestamp: new Date()
      };

      this.displayQueue.push(orderDisplay);
      return this.sendToDisplay(orderDisplay);
    } catch (error) {
      console.error('Failed to display order:', error);
      return false;
    }
  }

  private async sendToDisplay(orderDisplay: OrderDisplay): Promise<boolean> {
    if (!this.device) return false;

    try {
      // Format data for display
      const displayData = new TextEncoder().encode(
        JSON.stringify({
          orderId: orderDisplay.orderId,
          content: orderDisplay.content,
          priority: orderDisplay.priority,
          timestamp: orderDisplay.timestamp.toISOString()
        })
      );

      await this.device.transferOut(1, displayData);
      console.log('Order sent to kitchen display:', orderDisplay.orderId);
      return true;
    } catch (error) {
      console.error('Failed to send order to display:', error);
      return false;
    }
  }

  private formatOrderForDisplay(orderData: any): string {
    const { orderNumber, tableNumber, items, specialInstructions } = orderData;
    
    let content = `Order: ${orderNumber}\n`;
    content += `Table: ${tableNumber || 'Takeout'}\n`;
    content += `Time: ${new Date().toLocaleTimeString()}\n`;
    content += '---\n';
    
    if (items) {
      items.forEach((item: any) => {
        content += `${item.quantity}x ${item.name}\n`;
        if (item.specialInstructions) {
          content += `  • ${item.specialInstructions}\n`;
        }
      });
    }
    
    if (specialInstructions) {
      content += `\nSpecial: ${specialInstructions}\n`;
    }
    
    return content;
  }

  private calculatePriority(orderData: any): 'low' | 'medium' | 'high' {
    const orderTime = new Date(orderData.orderTime || Date.now());
    const now = new Date();
    const minutesElapsed = (now.getTime() - orderTime.getTime()) / (1000 * 60);
    
    if (minutesElapsed > 20) return 'high';
    if (minutesElapsed > 10) return 'medium';
    return 'low';
  }

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    if (!this.isConnected || !this.device) return false;

    try {
      const statusUpdate = new TextEncoder().encode(
        JSON.stringify({
          action: 'updateStatus',
          orderId,
          status,
          timestamp: new Date().toISOString()
        })
      );

      await this.device.transferOut(1, statusUpdate);
      console.log('Order status updated:', orderId, status);
      return true;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  }

  async getStatus(): Promise<DisplayStatus> {
    if (!this.isConnected) {
      return {
        connected: false,
        brightness: 0,
        temperature: 0,
        error: 'Kitchen display not connected'
      };
    }

    try {
      // In a real implementation, you'd query the actual hardware
      return {
        connected: true,
        brightness: 80,
        temperature: 35
      };
    } catch (error) {
      return {
        connected: false,
        brightness: 0,
        temperature: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  disconnect(): void {
    if (this.device) {
      this.device.close();
      this.device = null;
      this.isConnected = false;
      console.log('Kitchen display disconnected');
    }
  }
}

export default new KitchenDisplayHardwareService();
