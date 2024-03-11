import { TooltipModel as CJTooltipModel } from 'chart.js/auto';
import { CJUnknownChartType } from '../../types';

export enum TooltipInteractionMode {
  Index = 'index',
  Point = 'point',
  Nearest = 'nearest',
}

export enum TooltipInteractionAxis {
  X = 'x',
  Y = 'y',
  XY = 'xy',
}

export interface TooltipOptions {
  useNative?: boolean;
  fontSize?: string;
  content?: string;
  borderRadius?: string;
  maxWidth?: string;
  padding?: string;
  title?: string | string[] | ((tooltip: CJTooltipModel<CJUnknownChartType>) => string | string[]);
  formatTitle?: (title: string) => string;
  formatLabel?: (item: string) => string;
  formatValue?: (value: number) => string;
  footer?: string | string[] | ((a: unknown) => string | string[]);
  showPercentage?: boolean;
  showUnit?: boolean;
  combineItems?: boolean;
  items?: TooltipItem[] | ((tooltip: CJTooltipModel<CJUnknownChartType>) => TooltipItem[]);
  sortItems?: (items: TooltipItem[]) => TooltipItem[];

  interactionMode?: TooltipInteractionMode;
  interactionAxis?: TooltipInteractionAxis;
}

export interface TooltipItem {
  colors: { backgroundColor: string; borderColor: string };
  label: string;
  value?: number;
  percent?: number;
  active?: boolean;
}
