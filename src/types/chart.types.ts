export type LayoutPosition = 'left' | 'top' | 'right' | 'bottom' | 'center' | 'chartArea' | { [scaleId: string]: number };

export interface ChartOptions {
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
}

export interface LegendOptions {
  isLegendClick?: boolean;
  legendDisplay?: boolean;
  legendPosition?: LayoutPosition;
  legendLabelsHeight?: number;
  legendLabelsWidth?: number;
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
