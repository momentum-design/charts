import { ChartOptions } from '../../types';

export interface PieChartOptions extends ChartOptions {
  cutout?: string;
  centerLabel?: string | number;
}
