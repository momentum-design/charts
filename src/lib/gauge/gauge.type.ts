import { ChartData, ChartOptions } from '../../types';

export type GaugeData = {
  dialData: ChartData;
  value: number;
};

export type DataView = {
  category: { name?: string; labels?: unknown[] };
  series: {
    name?: string;
    data: number[];
  }[];
  value: number;
};

export interface GaugeOptions extends ChartOptions {
  innerRadius?: string | number;
}

export interface GaugeDataModel {
  data: {
    [key: string]: string | number;
  }[];
}
