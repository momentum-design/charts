import { ChartDataset, ChartOptions } from 'chart.js/auto';

export interface PieChartData extends ChartDataset<'pie', number[]> {}

export interface PieChartOptions extends ChartOptions<'pie'> {
  theme?: string | [];
  isLegendFilter?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  legendFilterCallback?: Function;
}
