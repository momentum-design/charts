import { ChartEvent as CJEvent } from 'chart.js/auto';
import { Chart } from '../lib/.internal';
import { ChartData, ChartOptions } from '../types';

export enum ChartEventType {
  LegendItemClick = 'legendItemClick',
  LegendItemSelect = 'legendItemSelect',
  LegendItemUnselect = 'legendItemUnselect',
  SeriesItemClick = 'seriesItemClick',
  WorkClick = 'wordClick',
  Wheel = 'wheel',
}

export interface EventContext<TData> {
  data: TData;
  chart: Chart<ChartData, ChartOptions>;
  event?: Event | CJEvent;
}

export class ChartEvent<TData> extends Event {
  constructor(name: ChartEventType, public context?: EventContext<TData>, options?: EventInit) {
    super(
      name,
      options ||
        {
          // bubbles: true,
          // cancelable: true,
          // composed: true,
        },
    );
  }

  getData(): TData | undefined {
    return this.context?.data;
  }
}
