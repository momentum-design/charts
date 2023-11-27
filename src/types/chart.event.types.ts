import { ChartEvent as CJEvent } from 'chart.js/auto';
import { Chart } from '../lib/.internal';
import { ChartData, ChartOptions } from '../types';
import { LegendItem } from '../types/chart.legend.types';

export enum EventType {
  LegendItemClick = 'legendItemClick',
  WorkClick = 'wordClick',
}

export interface EventContext<TData> {
  data: TData;
  event?: Event | CJEvent;
  chart?: Chart<ChartData, ChartOptions>;
}

export type LegendItemClickContext = EventContext<LegendItem>;
