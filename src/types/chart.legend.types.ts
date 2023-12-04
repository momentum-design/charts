import { MarkerStyle, Position, TooltipOptions } from '.';
import { LegendItemClickContext } from './chart.event.types';

export interface LegendItem {
  text: string;
  color: string;
  isSelected?: boolean;
}

export interface LegendOptions {
  selectable?: boolean;
  onItemClick?(context: LegendItemClickContext): void;
  display?: boolean;
  position?: Position;
  markerStyle?: MarkerStyle;
  tooltip?: TooltipOptions;
}
