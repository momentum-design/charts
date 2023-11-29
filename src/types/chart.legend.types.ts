import { Position, TooltipOptions } from '.';
import { LegendItemClickContext } from './chart.event.types';

export interface LegendItem {
  text: string;
  color: string;
  isSelected?: boolean;
}

export interface LegendOptions {
  itemSelectable?: boolean;
  onItemClick?(context: LegendItemClickContext): void;
  display?: boolean;
  position?: Position;
  tooltip?: TooltipOptions;
}
