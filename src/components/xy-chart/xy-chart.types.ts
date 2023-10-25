/**
 * The default options for xy chart.
 */
import { TimeUnit } from 'chart.js';
import { ChartOptions } from '../../types';
interface AxisOptions {
  title?: string;
  type?: 'category' | 'time';
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  stacked?: boolean;
  display?: boolean;
  gridDisplay?: boolean;
}

interface CategoryAxisOptions extends AxisOptions {
  enableColor?: boolean;
  dataKey: string;
  timeUnit?: TimeUnit;
  labelFormat?: string;
  tooltipFormat?: string;
}
interface ValueAxisOptions extends AxisOptions {
  unit?: string;
}

export interface XYChartOptions extends ChartOptions {
  seriesOptions?: {
    styleMapping: {
      [key: string]: {
        type?: 'bar' | 'line';
        lineStyle?: 'solid' | 'dashed';
      };
    };
  };
  categoryAxis?: CategoryAxisOptions;
  valueAxis?: ValueAxisOptions;
}
// export type DataTableLike = unknown[][] | { cols: unknown[]; rows?: unknown[][] };
export type DataTableLike = unknown[][] | Record<string, string | number>[];
export type DataView = {
  category: { name?: string; labels?: unknown[] };
  series: {
    name: string;
    data?: number[];
  }[];
};

export interface GenericDataModel {
  categoryKey?: string;
  data: {
    [key: string]: string | number;
  }[];
}
