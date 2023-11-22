import { ChartOptions, JsonData, TableData } from '../../types';

export interface PieOptions extends ChartOptions {
  cutout?: string | number;
  additionalLabel?: string | number;
  dataKey?: string;
  doughnutLabel?: DoughnutLabel;
}

export interface DoughnutLabel {
  enable?: boolean;
  label?: string;
}

export type PieData = TableData | JsonData;

export type DataView = {
  category: { name?: string; labels?: unknown[] };
  series: {
    name?: string;
    data: number[];
  }[];
};

/**
 * Common data model
 */
export interface GenericDataModel {
  /**
   *  The category field on the category axis.
   */
  dataKey?: string;
  data: {
    [key: string]: string | number;
  }[];
}
