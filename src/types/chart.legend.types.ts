import type { TooltipOptions } from '../charts/tooltip';
import type { ChartEvent } from './chart.event.types';
import type { MarkerStyle, Position } from './chart.types';
import type { Font } from './font.types';

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
