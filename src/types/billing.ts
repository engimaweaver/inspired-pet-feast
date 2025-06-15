
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  discount?: number;
  notes?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

export interface CustomerInfo {
  name?: string;
  phone?: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  address?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'upi' | 'other';
}
