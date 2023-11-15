/**
 * The default options for xy chart.
 */
import { TimeUnit } from 'chart.js';
import { ChartOptions, JsonData, TableData } from '../../types';

/**
 * Interface `AxisOptions` provides a set of configurations for the axis in a chart.
 */
interface AxisOptions {
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
}

/**
 * This interface provides options for configuring the category axis.
 */
interface CategoryAxisOptions extends AxisOptions {
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
}
interface ValueAxisOptions extends AxisOptions {
  unit?: string;
}

export interface XYChartOptions extends ChartOptions {
  /**
   * The options for the series.
   */
  seriesOptions?: {
    /**
     * The style mapping is an object where keys are string identifiers.
     */
    styleMapping: {
      [key: string]: {
        type?: 'bar' | 'line' | 'area';
        lineStyle?: 'solid' | 'dashed';
      };
    };
  };
  /**
   * Options for configuring the category axis.
   */
  categoryAxis?: CategoryAxisOptions;
  /**
   * Options for configuring the value axis.
   */
  valueAxis?: ValueAxisOptions; //TODO remove it
  valueAxes?: ValueAxisOptions[]; //TODO support multi valueAxes
}

/**
 * The "DataTableLike" type can be a two-dimensional array (unknown[][]) or an array of objects (Record<string, string | number>[]).
 */
export type DataTableLike = TableData | JsonData;

/**
 * Data model required for chart rendering.
 */
export type DataView = {
  category: { name?: string; labels?: unknown[] };
  series: {
    name: string;
    data?: number[];
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
