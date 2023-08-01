import { ChartDataset, ChartOptions } from 'chart.js/auto';

export interface PieChartData extends ChartDataset<'pie', number[]> {
  centerValue?: string | number;
}

export interface PieChartOptions extends ChartOptions<'pie'> {
  type?: string;
  theme?: string | [];
  isLegendClick?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  legendClickCallback?: Function;
}
