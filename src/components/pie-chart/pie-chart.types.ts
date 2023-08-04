import { ChartOptions } from '../../core/common/chart.types';

export interface PieChartOptions extends ChartOptions {
  cutout?: string;
  centerLabel?: string | number;
}
