export type Position = 'left' | 'top' | 'right' | 'bottom';

export type ChartContainer =
  | string
  | CanvasRenderingContext2D
  | HTMLCanvasElement
  | { canvas: HTMLCanvasElement }
  | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>;

export type TableData = Array<Array<string | number | boolean>>;
export type ChartData = any | TableData;

export interface ChartOptions {
  title?: string;
  chartLabel?: string | number | string[]; // TODO: remove it, please use series name.
  theme?: string | []; // TODO: remove empty array
  fontColor?: string;
  fontFamily?: string;
  aspectRatio?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  legend?: LegendOptions;
  tooltip?: TooltipOptions;
  colorMapping?: {
    [key: string]: string;
  };
  colorSet?: string[];
}

export interface LegendOptions {
  isLegendClick?: boolean;
  legendDisplay?: boolean;
  legendPosition?: Position;
  legendLabelsHeight?: number;
  legendLabelsWidth?: number;
  legendBorderRadius?: number;
}

export interface TooltipOptions {
  isMultipleSeries?: boolean;
  seriesTooltipHead?: string;
  seriesTooltipBody?: string;
  seriesTooltipFooter?: string;
  seriesTooltipFloor?: number;
  isMultipleLegend?: boolean;
  legendTooltipHead?: string;
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
