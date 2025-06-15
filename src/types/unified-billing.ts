
import { OrderItem, MenuItem } from '@/types/billing';
import { GSTBreakdown } from '@/types/gst';

export interface UnifiedOrderItem extends OrderItem {
  hsnCode?: string;
  gstRate?: number;
  discount?: number;
  notes?: string;
}

export interface BillSummary {
  items: UnifiedOrderItem[];
  subtotal: number;
  totalDiscount: number;
  gstBreakdown: GSTBreakdown;
  grandTotal: number;
  customerInfo?: {
    name?: string;
    phone?: string;
    gstin?: string;
    address?: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  nameHindi: string;
  icon: string;
  color: string;
  requiresAmount?: boolean;
  showQR?: boolean;
}
