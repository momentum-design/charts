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
  borderRadius?: string;
  maxWidth?: string;
  padding?: string;
  zIndex?: number;
  title?: string | string[] | ((tooltip: CJTooltipModel<CJUnknownChartType>) => string | string[]);
  formatTitle?: (title: string) => string;
  beforeBody?: string | ((tooltip: CJTooltipModel<CJUnknownChartType>) => string);
  formatLabel?: (item: string) => string;
  formatValue?: (value: number, tooltip?: CJTooltipModel<CJUnknownChartType>) => string;
  afterBody?: string | ((tooltip: CJTooltipModel<CJUnknownChartType>) => string);
  footer?: string | string[] | ((a: unknown) => string | string[]);
  showPercentage?: boolean;
  showUnit?: boolean;
  showTotal?: boolean;
  totalLabel?: string;
  combineItems?: boolean;
  appendToBody?: boolean;
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

export interface PositionStyle {
  arrow?: { top: string; left: string; borderDirection: string; transform: string };
  transform: string;
}

export enum PositionDirection {
  CenterTop = 'center-top',
  RightTop = 'right-top',
  RightCenter = 'right-center',
  RightBottom = 'right-bottom',
  CenterBottom = 'center-bottom',
  LeftBottom = 'left-bottom',
  LeftCenter = 'left-center',
  LeftTop = 'left-top',
  CenterCenter = 'center-center',
}
