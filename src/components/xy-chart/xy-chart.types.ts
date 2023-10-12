import { TimeUnit } from 'chart.js';
import { DefaultOptions } from '../../types';

/**
 * The default options for xy chart.
 */
export interface XYChartOptions extends DefaultOptions {
  /**
   * Enables multi-color mode for the chart where each data point can have a different color.
   */
  multiColor?: boolean;
  visualStyle?: 'normal' | 'area' | 'range';
  lineStyle?: 'solid' | 'dashed';
  indexAxis?: 'x' | 'y';
  xTitle?: string;
  yTitle?: string;
  xType?: 'linear' | 'logarithmic' | 'category' | 'time' | 'timeseries';
  yType?: 'linear' | 'logarithmic' | 'category' | 'time' | 'timeseries';
  categoryIsTime?: boolean;
  categoryKey?: string;
  timeOptions?: {
    unit?: TimeUnit;
    dateFormat?: string;
  };
  xStacked?: boolean;
  yStacked?: boolean;
  xGridDisplay?: boolean;
  yGridDisplay?: boolean;
}

// export type DataTableLike = unknown[][] | { cols: unknown[]; rows?: unknown[][] };
export type DataTableLike = unknown[][] | Record<string, string | number>[];
export type DataView = {
  category: { name?: string; labels?: unknown[] };
  series: {
    name?: string;
    data?: number[];
  }[];
};

export interface GenericDataModel {
  categoryKey?: string;
  data: {
    [key: string]: string | number;
  }[];
}
