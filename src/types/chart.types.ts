export type LayoutPosition = 'left' | 'top' | 'right' | 'bottom' | 'center' | 'chartArea' | { [scaleId: string]: number };

export interface ChartOptions {
  title?: string;
  responsive?: boolean;
  chartLabel?: string | number | string[];
  theme?: string | [];
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

export enum ChartTypeEnum {
  Area = 'area',
  Bar = 'bar',
  Column = 'column',
  Line = 'line',
  Pie = 'pie',
  Doughnut = 'doughnut',
  Range = 'range',
}
