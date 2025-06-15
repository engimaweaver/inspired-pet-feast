
import { CHART_COLORS } from '@/constants/dashboardData';

export const getDefaultCartesianGrid = () => ({
  strokeDasharray: "3 3",
  stroke: CHART_COLORS.grid
});

export const getDefaultAxis = () => ({
  stroke: CHART_COLORS.text
});

export const getBarChartConfig = (dataKey: string) => ({
  dataKey,
  fill: CHART_COLORS.primary,
  radius: [4, 4, 0, 0] as [number, number, number, number]
});

export const getLineChartConfig = (dataKey: string) => ({
  type: "monotone" as const,
  dataKey,
  stroke: CHART_COLORS.success,
  strokeWidth: 3,
  dot: { fill: CHART_COLORS.success, strokeWidth: 2, r: 4 }
});
