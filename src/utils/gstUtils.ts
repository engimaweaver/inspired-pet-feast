
import { GSTBreakdown, HSNCode, TaxInvoiceItem } from '@/types/gst';
import { HSN_CODES } from '@/constants/indiaData';

export const calculateGST = (amount: number, gstRate: number, isInterState: boolean = false): GSTBreakdown => {
  const totalGST = (amount * gstRate) / 100;
  
  if (isInterState) {
    return {
      cgst: 0,
      sgst: 0,
      igst: totalGST,
      total: totalGST
    };
  } else {
    return {
      cgst: totalGST / 2,
      sgst: totalGST / 2,
      igst: 0,
      total: totalGST
    };
  }
};

export const validateGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

export const getHSNDetails = (hsnCode: string): HSNCode | null => {
  for (const category of Object.values(HSN_CODES)) {
    if (category[hsnCode as keyof typeof category]) {
      const details = category[hsnCode as keyof typeof category];
      return {
        code: hsnCode,
        description: details.description,
        gstRate: details.gstRate,
        cgstRate: details.gstRate / 2,
        sgstRate: details.gstRate / 2,
        igstRate: details.gstRate
      };
    }
  }
  return null;
};

export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const numberToWords = (amount: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertGroup = (num: number): string => {
    let result = '';
    
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    
    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    } else if (num >= 10) {
      result += teens[num - 10] + ' ';
      return result;
    }
    
    if (num > 0) {
      result += ones[num] + ' ';
    }
    
    return result;
  };
  
  if (amount === 0) return 'Zero Rupees Only';
  
  let rupeesAmount = Math.floor(amount);
  const paise = Math.round((amount - rupeesAmount) * 100);
  
  let result = '';
  
  if (rupeesAmount >= 10000000) {
    result += convertGroup(Math.floor(rupeesAmount / 10000000)) + 'Crore ';
    rupeesAmount %= 10000000;
  }
  
  if (rupeesAmount >= 100000) {
    result += convertGroup(Math.floor(rupeesAmount / 100000)) + 'Lakh ';
    rupeesAmount %= 100000;
  }
  
  if (rupeesAmount >= 1000) {
    result += convertGroup(Math.floor(rupeesAmount / 1000)) + 'Thousand ';
    rupeesAmount %= 1000;
  }
  
  if (rupeesAmount > 0) {
    result += convertGroup(rupeesAmount);
  }
  
  result += 'Rupees';
  
  if (paise > 0) {
    result += ' and ' + convertGroup(paise) + 'Paise';
  }
  
  return result + ' Only';
};
