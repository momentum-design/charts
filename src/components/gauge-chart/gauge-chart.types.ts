import { ChartDataset, ChartOptions } from 'chart.js/auto';

export interface GaugeChartData extends ChartDataset<'doughnut', number[]> {
  value?: number;
}

export interface GaugeChartOptions extends ChartOptions<'doughnut'> {
  theme?: string | [];
}
