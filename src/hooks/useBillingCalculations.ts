
import { useState, useMemo } from 'react';
import { UnifiedOrderItem, BillSummary } from '@/types/unified-billing';
import { calculateGST, formatIndianCurrency, getHSNDetails } from '@/utils/gstUtils';

export const useBillingCalculations = (items: UnifiedOrderItem[], isInterState: boolean = false) => {
  const calculations = useMemo((): BillSummary => {
    const subtotal = items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const discountAmount = item.discount 
        ? (item.discount > 1 ? item.discount : (itemTotal * item.discount / 100))
        : 0;
      return total + (itemTotal - discountAmount);
    }, 0);

    const totalDiscount = items.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const discountAmount = item.discount 
        ? (item.discount > 1 ? item.discount : (itemTotal * item.discount / 100))
        : 0;
      return total + discountAmount;
    }, 0);

    // Calculate GST based on items
    let totalGST = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const discountAmount = item.discount 
        ? (item.discount > 1 ? item.discount : (itemTotal * item.discount / 100))
        : 0;
      const taxableAmount = itemTotal - discountAmount;
      
      // Get GST rate from HSN code or default to 18%
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
      totalGST += gstBreakdown.total;
    });

    return {
      items,
      subtotal,
      totalDiscount,
      gstBreakdown: {
        cgst: totalCGST,
        sgst: totalSGST,
        igst: totalIGST,
        total: totalGST
      },
      grandTotal: subtotal + totalGST
    };
  }, [items, isInterState]);

  return calculations;
};
