
export interface BillingItem {
  price: number;
  quantity: number;
  discount?: number;
}

export interface BillingTotals {
  subtotal: number;
  discount: number;
  gstAmount: number;
  grandTotal: number;
}

export const calculateSubtotal = (items: BillingItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const calculateTotalDiscount = (items: BillingItem[]): number => {
  return items.reduce((total, item) => {
    if (!item.discount) return total;
    const itemTotal = item.price * item.quantity;
    const discountAmount = item.discount > 1 ? item.discount : (itemTotal * item.discount / 100);
    return total + discountAmount;
  }, 0);
};

export const calculateGSTAmount = (subtotal: number, rate: number = 0.18): number => {
  return Math.round(subtotal * rate);
};

export const calculateGrandTotal = (subtotal: number, gstAmount: number, discount: number = 0): number => {
  return subtotal - discount + gstAmount;
};

export const calculateBillingTotals = (items: BillingItem[], gstRate: number = 0.18): BillingTotals => {
  const subtotal = calculateSubtotal(items);
  const discount = calculateTotalDiscount(items);
  const taxableAmount = subtotal - discount;
  const gstAmount = calculateGSTAmount(taxableAmount, gstRate);
  const grandTotal = calculateGrandTotal(subtotal, gstAmount, discount);

  return {
    subtotal,
    discount,
    gstAmount,
    grandTotal,
  };
};
