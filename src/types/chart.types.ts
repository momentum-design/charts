import { defaultTheme } from '../core';

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

const chartOptions: ChartOptions = {
  responsive: true,
  chartLabel: '',
  theme: defaultTheme,
  fontColor: '#000',
  fontFamily: 'Helvetica',
  aspectRatio: 1.6,
  legendLabelsHeight: 12,
  legendLabelsWidth: 12,
};

export { chartOptions };
