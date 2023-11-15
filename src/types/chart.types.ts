import { Padding } from './common.types';

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
  aspectRatio?: number; //TODO: calculate this property for all charts, remove it here
  padding?: Padding | number;
  legend?: LegendOptions;
  tooltip?: TooltipOptions;
  colorMapping?: {
    [key: string]: string;
  };
  colorSet?: string[];
}

export interface LegendOptions {
  isLegendClick?: boolean; //TODO onClick function
  display?: boolean;
  position?: Position;
  legendLabelsHeight?: number; //TODO remove it
  legendLabelsWidth?: number; //TODO remove it
  legendBorderRadius?: number; //TODO remove it
  tooltip?: TooltipOptions;
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
  Doughnut = 'doughnut',
  Range = 'range',
  WordCloud = 'wordCloud',
}
