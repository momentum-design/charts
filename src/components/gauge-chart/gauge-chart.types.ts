import { ChartOptions } from '../../types';

export interface GaugeChartOptions extends ChartOptions {
  cutout?: string;
  value?: number;
  circumference?: number;
  rotation?: number;
  fontColor?: string; //TODO: refine it
  fontSize?: number; //TODO: refine it
  fontFamily?: string; //TODO: refine it
}
