import { Font, LegendOptions, Padding } from '.';

export type Position = 'left' | 'top' | 'right' | 'bottom';

export type ChartContainer =
  | string
  | CanvasRenderingContext2D
  | HTMLCanvasElement
  | { canvas: HTMLCanvasElement }
  | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>;

export type TableData = Array<Array<string | number | boolean>>;
export type JsonData = Record<string, string | number>[];
export type ChartData = any | TableData | JsonData;

export interface ChartOptions {
  title?: string;
  chartLabel?: string | number | string[]; // TODO: remove it, please use series name.
  theme?: string;
  font?: Font;
  valueUnit?: string;
  padding?: Padding | number;
  legend?: LegendOptions;
  tooltip?: TooltipOptions;
  colorMapping?: {
    [key: string]: string;
  };
  colors?: string[];
  colorMode?: ColorMode;
}

export interface TooltipOptions {
  isMultipleSeries?: boolean; //TODO remove it
  seriesTooltipHead?: string; // TODO refine to series
  seriesTooltipBody?: string;
  seriesTooltipFooter?: string;
  seriesTooltipFloor?: number;
  isMultipleLegend?: boolean;
  legendTooltipHead?: string; //TODO refine to legend
  legendTooltipBody?: string;
  legendTooltipFooter?: string;
  legendTooltipFloor?: number;
}

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

export type MarkerStyle = 'circle' | 'rect' | 'rectRounded' | 'rectRot' | 'triangle' | false;
