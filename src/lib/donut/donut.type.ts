import { PieData, PieOptions } from '../pie/pie.types';

export type DonutData = PieData;

export interface DonutOptions extends PieOptions {
  donutLabel?: DonutLabel;
}

export interface DonutLabel {
  enable?: boolean;
  label?: string;
}
