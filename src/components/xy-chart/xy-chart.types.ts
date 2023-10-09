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
  stacked?: boolean | 'single';
  xGridDisplay?: boolean;
  yGridDisplay?: boolean;
}
