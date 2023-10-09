import { DefaultOptions } from '../../types';

export interface GaugeChartOptions extends DefaultOptions {
  cutout?: string;
  value?: number;
  circumference?: number;
  rotation?: number;
}
