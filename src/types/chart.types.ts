export type LayoutPosition = 'left' | 'top' | 'right' | 'bottom' | 'center' | 'chartArea' | { [scaleId: string]: number };

export interface ChartOptions {
  responsive?: boolean;
  chartLabel?: string | number | string[];
  theme?: string | [];
  fontColor?: string;
  fontFamily?: string;
  aspectRatio?: number;
  isLegendClick?: boolean;
  legendDisplay?: boolean;
  legendPosition?: LayoutPosition;
  legendLabelsHeight?: number;
  legendLabelsWidth?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
}
