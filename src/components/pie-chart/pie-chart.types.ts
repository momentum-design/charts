import { ChartOptions } from '../../core/common/chart.types';

export interface PieChartData {
  data: number[];
  label?: string;
  backgroundColor?: string[];
  centerLabel?: string | number;
}

export interface PieChartOptions extends ChartOptions {
  cutout?: string;
}
