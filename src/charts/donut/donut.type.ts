import { Font } from '../../types';
import { PieChartOptions, PieData } from '../pie/pie.types';

export type DonutData = PieData;

export interface DonutChartOptions extends PieChartOptions {
  centerLabels?: CenterLabel[];
}

export interface CenterLabel {
  text?: string;
  font?: Font;
}
