import { Chart } from '../lib/.internal';
import { ChartData, ChartOptions } from '../types';

export enum EventType {
  LegendItemClick = 'legendItemClick',
  WorkClick = 'wordClick',
}

export interface EventContext<TData> {
  data: TData;
  chart?: Chart<ChartData, ChartOptions>;
}
