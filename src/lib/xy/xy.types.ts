/**
 * The default options for xy chart.
 */
import { Tick, TimeUnit } from 'chart.js';
import { ChartOptions, JsonData, MarkerStyle, TableData } from '../../types';
/**
 * Interface `AxisOptions` provides a set of configurations for the axis in a chart.
 */
export interface AxisOptions {
  /**
   * Title of the axis.
   */
  title?: string;
  /**
   * Type of scale being employed. Custom scales can be created and registered with a string key. This allows changing the type of an axis for a chart.
   */
  type?: 'category' | 'time';
  /**
   * The location of the axis on the chart.
   */
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  /**
   * Should the data be stacked.
   */
  stacked?: boolean;
  /**
   * Controls the axis global visibility (visible when true, hidden when false)
   */
  display?: boolean;
  /**
   * Controls the grid of axis global visibility (visible when true, hidden when false)
   */
  gridDisplay?: boolean;
  /**
   * Maximum number of ticks and gridlines to show.
   */
  maxTicksLimit?: number;
  /**
   *   If true, automatically calculates how many labels can be shown and hides labels accordingly. Labels will be rotated up to maxRotation before skipping any. Turn autoSkip off to show all labels no matter what.
   * @default true
   */
  autoSkip?: boolean;
  /**
   * Padding between the ticks on the horizontal axis when autoSkip is enabled.
   */
  ticksPadding?: number;
  /**
   * User defined fixed step size for the scale
   */
  ticksStepSize?: number;
  /**
   * Color of tick
   */
  ticksColor?: string;

  callback?: (
    tickValue: number | string,
    index?: number,
    ticks?: Tick[],
  ) => string | string[] | number | number[] | null | undefined;
}
/**
 * This interface provides options for configuring the category axis.
 */
export interface CategoryAxisOptions extends AxisOptions {
  /**
   * Set to true, the colors of each category of the series are recycled.
   * Set to false, all categories of each series are one color
   */
  enableColor?: boolean;
  /**
   *  The category field on the category axis.
   */
  dataKey?: string;
  /**
   * Specifies the time unit on the category axis.
   */
  timeUnit?: TimeUnit;
  /**
   * Specifies the date format of labels on the category axis.
   */
  labelFormat?: string;
  /**
   * Specifies the format of the tooltip displayed for data points on the category axis.
   */
  tooltipFormat?: string;

  maxLabels?: number;
  /**
   * The supported type is category, but time is not supported.
   */
  selectable?: boolean;
  onLabelClick?(label: string | undefined, selectedLabels?: string[]): void;
}
export interface ValueAxisOptions extends AxisOptions {
  /**
   * User defined minimum value for the scale, overrides minimum value from data.
   */
  min?: number;
  /**
   * User defined maximum value for the scale, overrides maximum value from data.
   */
  max?: number;
  /**
   * Adjustment used when calculating the maximum data value.
   */
  suggestedMin?: number;
  /**
   * Adjustment used when calculating the minimum data value.
   */
  suggestedMax?: number;
}

export interface SeriesStyleOptions {
  type?: 'bar' | 'line' | 'area' | 'dashed' | 'dashedArea';
  valueAxisIndex?: number;
  tension?: number;
  order?: number;
  markerStyle?: MarkerStyle;
  fillGaps?: boolean;
}
export interface XYChartOptions extends ChartOptions {
  /**
   * The options for the series.
   */
  seriesOptions?: {
    /**
     * The style mapping is an object where keys are string identifiers.
     */
    styleMapping?: {
      [key: string]: SeriesStyleOptions;
    };
  };
  /**
   * Options for configuring the category axis.
   */
  categoryAxis?: CategoryAxisOptions;
  /**
   * Options for configuring the value axis.
   */
  valueAxes?: ValueAxisOptions[];

  scrollable?: boolean;
  scrollDirection?: 'x' | 'y' | 'xy';
}
/**
 * The "DataTableLike" type can be a two-dimensional array (unknown[][]) or an array of objects (Record<string, string | number>[]).
 */
export type XYData = TableData | JsonData;
