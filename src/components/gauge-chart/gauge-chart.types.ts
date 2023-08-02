import { ChartOptions } from '../../core/common/chart.types';

export interface GaugeChartData {
  data: number[];
  value?: number;
  backgroundColor?: string[];
}

export interface GaugeChartOptions extends ChartOptions {
  cutout?: string;
  circumference: number;
  rotation: number;
}
