
export interface BillingItem {
  price: number;
  quantity: number;
}

export const calculateSubtotal = (items: BillingItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const calculateGSTAmount = (subtotal: number, rate: number = 0.18): number => {
  return Math.round(subtotal * rate);
};

export const calculateGrandTotal = (subtotal: number, gstAmount: number): number => {
  return subtotal + gstAmount;
};
