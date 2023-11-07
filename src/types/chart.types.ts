// TODO: rename to Position
export type LayoutPosition = 'left' | 'top' | 'right' | 'bottom';

export type ChartContainer = string | CanvasRenderingContext2D | HTMLCanvasElement | { canvas: HTMLCanvasElement } | ArrayLike<CanvasRenderingContext2D | HTMLCanvasElement>;

export type TableData = Array<Array<string | number | boolean>>;
export type ChartData = any | TableData;

export interface ChartOptions {
  type?: ChartTypeEnum; // TODO: remove optional
  title?: string;
  responsive?: boolean; // TODO: remove it as it has a default value.
  chartLabel?: string | number | string[]; // TODO: if it is only for donut chart, it should be moved into PieChartOptions
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
  legendPosition?: LayoutPosition;
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

// TODO: rename to ChartType
export enum ChartTypeEnum {
  Area = 'area',
  Bar = 'bar',
  Column = 'column',
  Line = 'line',
  Pie = 'pie',
  Doughnut = 'doughnut',
  Range = 'range',
  WordCloud = 'wordCloud',
}
