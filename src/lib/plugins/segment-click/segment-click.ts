import { ActiveElement, Chart as CJ, ChartEvent as CJChartEvent, LegendItem as CJLegendItem } from 'chart.js/auto';
import { cloneDeep } from 'lodash-es';
import {
  ChartData,
  ChartEvent,
  ChartEventType,
  ChartOptions,
  CJElement,
  EventContext,
  LegendItem,
} from '../../../types';
import { Chart } from '../../.internal';

export class SegmentClickable<TChart extends Chart<ChartData, ChartOptions>> {
  public selectedSegment: LegendItem[] = [];

  constructor(public chart: TChart) {}

  public onSegmentClick(cjEvent: CJChartEvent, elements: ActiveElement[], chart: CJ): void {
    // TODO: Pie Chart use legend.selectable attribute.
    if (!elements || !elements.length || !this.chart.options.legend?.selectable) return;
    // TODO: element.index is Pie chart attribute.
    const clickedSeriesIndex: number[] = elements.map((element: ActiveElement) => element.index);

    const cjLegendItem: CJLegendItem = {
      text: (chart.data.labels && chart.data.labels[clickedSeriesIndex[0]]) as string,
      index: clickedSeriesIndex[0],
    };

    if (chart.legend?.options.onClick) {
      chart.legend.options.onClick.call(chart.legend, cjEvent, cjLegendItem, chart.legend);
    }

    const eventContext: EventContext<LegendItem[]> = {
      chart: this.chart,
      data: this.selectedSegment,
      event: cjEvent,
    };
    const evt = new ChartEvent(ChartEventType.SegmentItemClick, eventContext);
    this.chart.rootElement?.dispatchEvent(evt);
  }

  public setSegmentStatus(manualTrigger = false): void {
    // TODO: Pie chart selectedSegment = this.chart.legend?.selectedItems
    this.selectedSegment = cloneDeep(this.chart.legend?.selectedItems as LegendItem[]);

    const metaData = this.chart.api?.getDatasetMeta(0);
    if (metaData) {
      metaData.data.forEach((item: CJElement, index: number) => {
        item.selected = Boolean(this.selectedSegment?.find((selected) => selected.index === index));
      });
    }

    if (manualTrigger) {
      this.chart.api?.update();
    }
  }
}
