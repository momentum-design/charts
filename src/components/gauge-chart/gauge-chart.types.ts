import { ChartOptions } from '../../types';

export interface GaugeChartOptions extends ChartOptions {
  cutout?: string;
  value?: number;
  circumference?: number;
  rotation?: number;
}
