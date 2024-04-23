/**
 * The default options for xy chart.
 */
import { Tick, TimeUnit } from 'chart.js';
import { ChartOptions, Font, JsonData, MarkerStyle, Position, SeriesType, TableData } from '../../types';
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
  position?: Position;
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
   * Rotation for tick labels when rotating to condense labels.
   * @default true
   */
  rotation?: boolean;
  /**
   * If true, automatically calculates how many labels can be shown and hides labels accordingly.
   * @default true
   */
  autoSkip?: boolean;
  /**
   * Tick width on the horizontal or vertical axis.                                                                                                                                                               .
   */
  tickWidth?: number;
  /**
   * User defined fixed step size for the axis.
   */
  ticksStepSize?: number;
  /**
   * Font of label
   */
  labelFont?: Font;
  /**
   * Returns the string representation of the tick values that should be displayed on the chart.
   */
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
  /**
   * The maximum number of ticks displayed.
   */
  maxLabels?: number;
  /**
   * The supported type is category, but time is not supported.
   */
  labelSelectable?: boolean;
  /**
   * Returns the currently selected label and all selected labels.
   * @param label The currently selected label
   * @param selectedLabels All selected labels
   */
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
  /**
   * The chart type of the series, if not set, it will be the same as the global type.
   */
  type?: SeriesType;
  /**
   * The index of the value axis.
   */
  valueAxisIndex?: number;
  /**
   * Bezier curve tension (0 means no bezier curve).
   */
  tension?: number;
  /**
   * The drawing order of dataset. Also affects order for stacking, tooltip and legend.
   */
  order?: number;
  /**
   * Style of the point.
   */
  markerStyle?: MarkerStyle;
  /**
   * If true, lines will be drawn between points with no or null data. If false, points with NaN data will create a break in the line. Can also be a number specifying the maximum gap length to span. The unit of the value depends on the scale used.
   */
  fillGaps?: boolean;
  /**
   * The line width (in pixels). default is 1
   */
  lineWidth?: number;
}
export interface XYChartOptions extends ChartOptions {
  /**
   * The options for the series.
   */
  seriesOptions?: {
    /**
     * The chart type of the series, if not set, it will be the same as the global type.
     */
    type?: SeriesType;
    /**
     * Bezier curve tension (0 means no bezier curve).
     */
    tension?: number;
    /**
     * The line width (in pixels). default is 1
     */
    lineWidth?: number;
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

  scrollDirection?: 'x' | 'y' | 'xy';
}
/**
 * The "DataTableLike" type can be a two-dimensional array (unknown[][]) or an array of objects (Record<string, string | number>[]).
 */
export type XYData = TableData | JsonData;
export enum ScaleKeys {
  CategoryAxis = 'categoryAxis',
  ValueAxis = 'valueAxis',
}
