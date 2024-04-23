import type { ChartEvent as CJEvent } from 'chart.js/auto';
import type { Chart } from '../charts/.internal';
import type { ChartData, ChartOptions } from '../types/chart.types';

export enum ChartEventType {
  LegendItemClick = 'legendItemClick',
  LegendItemSelect = 'legendItemSelect',
  LegendItemUnselect = 'legendItemUnselect',
  SegmentItemClick = 'SegmentItemClick',
  ThemeChange = 'themeChange',
  WordClick = 'wordClick',
  Wheel = 'wheel',
  MouseDown = 'mousedown',
  MouseMove = 'mousemove',
  MouseUp = 'mouseup',
  MouseLeave = 'mouseleave',
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
