import { ChartType as CJChartType, Element } from 'chart.js/auto';
import { Font, LegendOptions, Padding } from '.';
import { TooltipOptions } from '../charts/tooltip';
import { ThemeName } from '../core';

export type MarkerStyle = 'circle' | 'rect' | 'rectRounded' | 'rectRot' | 'triangle' | false;
export type SeriesType = 'bar' | 'line' | 'area' | 'dashed' | 'dashedArea';

export type ChartContainer =
  | string
  | CanvasRenderingContext2D
  | HTMLCanvasElement
  | { canvas: HTMLCanvasElement }
  | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>;

export type TableData = Array<Array<string | number | boolean>>;
export type JsonData = Record<string, string | number>[];
// eslint-disable-next-line
export type ChartData = any | TableData | JsonData;

export interface CJElement extends Element {
  selected?: boolean;
}

export interface ChartOptions {
  title?: string;
  colorSet?: string;
  font?: Font;
  valueUnit?: string;
  valuePrecision?: number;
  padding?: Padding | number;
  legend?: LegendOptions;
  tooltip?: TooltipOptions;
  colorMapping?: {
    [key: string]: string;
  };
  colors?: string[];
  colorMode?: ColorMode;
  theme?: ThemeName | string;
}

/**
 * Common data model
 */
export interface GenericDataModel {
  /**
   *  The category field on the category axis.
   */
  dataKey?: string;
  data: {
    [key: string]: string | number | null;
  }[];
}

/**
 * Data model required for chart rendering.
 */
export type ChartDataView = {
  category: { name?: string; labels?: string[] };
  series: {
    name: string;
    data?: (number | null)[];
  }[];
};

export type CJUnknownChartType = CJChartType;

export enum ChartType {
  Area = 'area',
  Bar = 'bar',
  Column = 'column',
  Line = 'line',
  Pie = 'pie',
  Donut = 'donut',
  Range = 'range',
  WordCloud = 'wordCloud',
  Gauge = 'gauge',
}

export enum ColorMode {
  Repeat = 'repeat',
  Random = 'random',
  Lighten = 'lighten',
  Darken = 'darken',
}

export enum Position {
  Left = 'left',
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Center = 'center',
}
