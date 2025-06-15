
export interface GSTDetails {
  gstin: string;
  legalName: string;
  tradeName: string;
  address: {
    buildingNo: string;
    streetName: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface HSNCode {
  code: string;
  description: string;
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
}

export interface GSTBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface TaxInvoiceItem {
  id: string;
  name: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxableValue: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

export interface TaxInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  customerGSTIN?: string;
  customerName: string;
  customerAddress: string;
  placeOfSupply: string;
  items: TaxInvoiceItem[];
  subtotal: number;
  totalTax: number;
  totalAmount: number;
  amountInWords: string;
}
