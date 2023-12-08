import { Font } from '../../types';
import { PieData, PieOptions } from '../pie/pie.types';

export type DonutData = PieData;

export interface DonutOptions extends PieOptions {
  centerLabels?: CenterLabel[];
}

export interface CenterLabel {
  text?: string;
  font?: Font;
}
