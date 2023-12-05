import { MarkerStyle, Position, TooltipOptions } from '.';
import { ChartEvent } from './chart.event.types';

export interface LegendItem {
  text: string;
  color: string;
  selected?: boolean;
  hidden?: boolean;
  index?: number;
}

export interface LegendOptions {
  selectable?: boolean;
  onItemClick?(event: ChartEvent<LegendItem>): void;
  display?: boolean;
  position?: Position;
  markerStyle?: MarkerStyle;
  tooltip?: TooltipOptions;
}
