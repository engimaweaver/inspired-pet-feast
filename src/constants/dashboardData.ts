
// Centralized dashboard data and configurations
export const DASHBOARD_METRICS = {
  revenue: { value: "$4,280", change: "+12.5%", trend: 'up' as const },
  orders: { value: "89", change: "+8.2%", trend: 'up' as const },
  customers: { value: "24/32", change: "75% occupied", trend: 'neutral' as const },
  rating: { value: "4.8", change: "+0.2 this week", trend: 'up' as const }
};

export const WEEKLY_CHART_DATA = [
  { day: 'Mon', orders: 45, revenue: 2400 },
  { day: 'Tue', orders: 52, revenue: 2800 },
  { day: 'Wed', orders: 38, revenue: 2200 },
  { day: 'Thu', orders: 61, revenue: 3200 },
  { day: 'Fri', orders: 78, revenue: 4100 },
  { day: 'Sat', orders: 89, revenue: 4800 },
  { day: 'Sun', orders: 67, revenue: 3600 },
];

export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  grid: '#f0f0f0',
  text: '#6b7280'
};
