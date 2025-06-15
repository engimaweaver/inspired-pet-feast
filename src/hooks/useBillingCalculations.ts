
import { useMemo } from 'react';
import { UnifiedOrderItem, BillSummary } from '@/types/unified-billing';
import { calculateBillingTotals } from '@/utils/billingCalculations';
import { calculateGST, getHSNDetails } from '@/utils/gstUtils';

export const useBillingCalculations = (items: UnifiedOrderItem[], isInterState: boolean = false) => {
  const calculations = useMemo((): BillSummary => {
    const billingItems = items.map(item => ({
      price: item.price,
      quantity: item.quantity,
      discount: item.discount,
    }));

    const { subtotal, discount: totalDiscount, gstAmount, grandTotal } = calculateBillingTotals(billingItems);

    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const discountAmount = item.discount 
        ? (item.discount > 1 ? item.discount : (itemTotal * item.discount / 100))
        : 0;
      const taxableAmount = itemTotal - discountAmount;
      
      let gstRate = 18;
      if (item.hsnCode) {
        const hsnDetails = getHSNDetails(item.hsnCode);
        if (hsnDetails) {
          gstRate = hsnDetails.gstRate;
        }
      }

      const gstBreakdown = calculateGST(taxableAmount, gstRate, isInterState);
      totalCGST += gstBreakdown.cgst;
      totalSGST += gstBreakdown.sgst;
      totalIGST += gstBreakdown.igst;
    });

    return {
      items,
      subtotal,
      totalDiscount,
      gstBreakdown: {
        cgst: totalCGST,
        sgst: totalSGST,
        igst: totalIGST,
        total: totalCGST + totalSGST + totalIGST
      },
      grandTotal
    };
  }, [items, isInterState]);

  return calculations;
};
