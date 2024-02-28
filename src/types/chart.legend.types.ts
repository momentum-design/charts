import { MarkerStyle, Position } from '.';
import { TooltipOptions } from '../lib/tooltip';
import { ChartEvent } from './chart.event.types';

export const inactiveColor = '#c9c9c9';
export interface LegendItem {
  text: string;
  color?: string;
  selected?: boolean;
  hidden?: boolean;
  index?: number;
}

export interface LegendOptions {
  selectable?: boolean;
  onItemClick?(event: ChartEvent<LegendItem>): void;
  display?: boolean;
  position?: Position;
  reverse?: boolean;
  markerStyle?: MarkerStyle;
  tooltip?: TooltipOptions;
  states?: {
    setSelected?: (item: LegendItem) => void;
    setUnSelected?: (item: LegendItem) => void;
    setItemInactiveStyle?: (item: LegendItem) => void;
    setItemActiveStyle?: (item: LegendItem) => void;
  };
}
