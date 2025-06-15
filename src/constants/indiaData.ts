
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep', 'Andaman and Nicobar Islands'
];

export const HSN_CODES = {
  FOOD_BEVERAGES: {
    '2106': { description: 'Food preparations not elsewhere specified', gstRate: 18 },
    '2202': { description: 'Waters, including mineral waters and aerated waters', gstRate: 18 },
    '2101': { description: 'Extracts, essences and concentrates of coffee, tea or mate', gstRate: 18 },
    '1905': { description: 'Bread, pastry, cakes, biscuits', gstRate: 18 },
    '0401': { description: 'Milk and cream', gstRate: 5 },
    '2208': { description: 'Undenatured ethyl alcohol; spirits, liqueurs', gstRate: 28 }
  }
};

export const SAMPLE_INDIAN_STAFF = [
  {
    id: '1',
    name: 'राज कुमार / Raj Kumar',
    position: 'Head Chef',
    phone: '+91 98765 43210',
    email: 'raj.kumar@restaurant.com',
    salary: 45000,
    joiningDate: '2023-01-15',
    aadharNumber: 'XXXX-XXXX-1234'
  },
  {
    id: '2',
    name: 'प्रिया शर्मा / Priya Sharma',
    position: 'Manager',
    phone: '+91 98765 43211',
    email: 'priya.sharma@restaurant.com',
    salary: 50000,
    joiningDate: '2023-02-01',
    aadharNumber: 'XXXX-XXXX-5678'
  },
  {
    id: '3',
    name: 'अमित पटेल / Amit Patel',
    position: 'Waiter',
    phone: '+91 98765 43212',
    email: 'amit.patel@restaurant.com',
    salary: 25000,
    joiningDate: '2023-03-10',
    aadharNumber: 'XXXX-XXXX-9012'
  }
];

export const SAMPLE_INDIAN_SUPPLIERS = [
  {
    id: '1',
    name: 'Mumbai Fresh Vegetables Pvt Ltd',
    contact: 'संजय गुप्ता / Sanjay Gupta',
    phone: '+91 22 2567 8901',
    email: 'sanjay@mumbaifreash.com',
    address: 'Shop 45, Crawford Market, Mumbai 400001',
    gstin: '27ABCDE1234F1Z5'
  },
  {
    id: '2',
    name: 'Delhi Dairy Products',
    contact: 'रीता सिंह / Rita Singh',
    phone: '+91 11 2345 6789',
    email: 'rita@delhidairy.in',
    address: 'Block A, Sector 12, Noida 201301',
    gstin: '07FGHIJ5678K2Y6'
  }
];

export const SAMPLE_MENU_ITEMS_INR = [
  { id: '1', name: 'Butter Chicken', price: 320, category: 'Main Course', hsnCode: '2106' },
  { id: '2', name: 'Dal Makhani', price: 180, category: 'Main Course', hsnCode: '2106' },
  { id: '3', name: 'Chicken Biryani', price: 380, category: 'Rice', hsnCode: '1905' },
  { id: '4', name: 'Paneer Tikka', price: 280, category: 'Starter', hsnCode: '2106' },
  { id: '5', name: 'Garlic Naan', price: 80, category: 'Bread', hsnCode: '1905' },
  { id: '6', name: 'Masala Chai', price: 40, category: 'Beverages', hsnCode: '2101' },
];
