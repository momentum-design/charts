import { ActiveElement, ChartEvent as CJChartEvent, LegendItem as CJLegendItem } from 'chart.js/auto';
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

  public onSegmentClick(cjEvent: CJChartEvent, elements: ActiveElement[], chart: any): void {
    // TODO: Pie Chart use legend.selectable attribute.
    if (!elements || !elements.length || !this.chart.options.legend?.selectable) return;
    // TODO: element.index is Pie chart attribute.
    const clickedSeriesIndex: number[] = elements.map((element: ActiveElement) => element.index);

    const cjLegendItem: CJLegendItem = {
      text: (chart.data.labels && chart.data.labels[clickedSeriesIndex[0]]) as string,
      index: clickedSeriesIndex[0],
    };
    chart.legend?.options?.onClick(cjEvent, cjLegendItem, 'onClick');

    const eventContext: EventContext<LegendItem[]> = {
      chart: this.chart,
      data: this.selectedSegment,
      event: cjEvent,
    };
    const evt = new ChartEvent(ChartEventType.SeriesItemClick, eventContext);
    this.chart.rootElement?.dispatchEvent(evt);
  }

  public setSelectedSegmentData(selectedIndex: number): void {
    const isSelected = this.selectedSegment.find((selected) => selected.index === selectedIndex);
    if (isSelected) {
      this.selectedSegment = this.selectedSegment.filter((selected) => selected.index !== selectedIndex);
    } else {
      const selectItem = {
        text: (this.chart.api?.data.labels && this.chart.api.data.labels[selectedIndex]) as string,
        index: selectedIndex,
      };
      this.selectedSegment.push(selectItem);
    }

    this.setSegmentStatus(this.selectedSegment);
  }

  public setSegmentStatus(selectedSegment: LegendItem[], manualTrigger = false): void {
    const metaData = this.chart.api?.getDatasetMeta(0);
    if (metaData) {
      metaData.data.forEach((item: CJElement, index: number) => {
        item.selected = Boolean(selectedSegment?.find((selected) => selected.index === index));
      });
    }

    if (manualTrigger) {
      this.selectedSegment = this.selectedSegment.filter((selectedItem) =>
        this.chart.legend?.selectedItems.find((item) => item.index === selectedItem.index),
      );
      this.chart.api?.update();
    }
  }
}
