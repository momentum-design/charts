import { TooltipOptions } from '../charts/tooltip';
import { ChartEvent } from './chart.event.types';
import { MarkerStyle, Position } from './chart.types';
import { Font } from './font.types';

export const inactiveColor = '#c9c9c9'; // TODO(bndynet): move to options
export interface LegendItem {
  text: string;
  color?: string;
  selected?: boolean;
  hidden?: boolean;
  index?: number;
}

export interface LegendOptions {
  font?: Font;
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
