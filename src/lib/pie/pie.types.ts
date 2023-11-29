import { ChartOptions, JsonData, TableData } from '../../types';

export interface PieOptions extends ChartOptions {
  innerRadius?: string | number;
  additionalLabel?: string | number;
  dataKey?: string;
}

export type PieData = TableData | JsonData | Record<string, string | number>;

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
