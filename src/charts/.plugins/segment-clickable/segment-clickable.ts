import {
  ActiveElement,
  Chart as CJ,
  ChartEvent as CJChartEvent,
  Element as CJElement,
  LegendItem as CJLegendItem,
} from 'chart.js/auto';
import { alphaColor, deepClone } from '../../../helpers';
import { ChartData, ChartEvent, ChartEventType, ChartOptions, EventContext, LegendItem } from '../../../types';
import type { Chart } from '../../.internal';

export class SegmentClickable<TChart extends Chart<ChartData, ChartOptions>> {
  public selectedSegment: LegendItem[] = [];

  constructor(public chart: TChart) {}

  public onClick(cjEvent: CJChartEvent, elements: ActiveElement[], chart: CJ): void {
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
    this.selectedSegment = deepClone(this.chart.legend?.selectedItems as LegendItem[]);

    const metaData = this.chart.api?.getDatasetMeta(0);
    if (metaData) {
      metaData.data.forEach((item: CJElement & { selected?: boolean }, index: number): void => {
        item.selected = Boolean(this.selectedSegment?.find((selected) => selected.index === index));
      });
    }

    if (manualTrigger) {
      this.chart.api?.update();
    }
  }

  public toCJPlugin(segmentColor: string | string[]): any {
    return {
      id: 'segmentClickable',
      beforeUpdate: (chart: CJ): void => {
        const data = chart.config.data;
        if (!data?.datasets?.length) {
          return;
        }
        const metaData = chart.getDatasetMeta(0);
        const originBG = segmentColor;

        const selectedArr = metaData?.data?.map((data: CJElement & { selected?: boolean }) => data?.selected ?? false);

        if (typeof originBG !== 'string' && originBG?.length > 0) {
          const result = originBG.map((color: string, index: number) => {
            if (selectedArr[index]) {
              return color;
            } else if (color) {
              return alphaColor(color, 0.4);
            }
          });
          data.datasets[0].backgroundColor = result;
        }

        if (selectedArr.every((selected) => selected === false)) {
          data.datasets[0].backgroundColor = originBG;
        }
      },
    };
  }
}
