import { ChartOptions, JsonData, TableData } from '../../types';

export interface PieChartOptions extends ChartOptions {
  innerRadius?: string | number;
  dataKey?: string;
}

export type PieData = TableData | JsonData | Record<string, string | number>;
