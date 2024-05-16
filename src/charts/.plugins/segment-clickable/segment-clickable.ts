import { ActiveElement, Chart as CJ, ChartEvent as CJChartEvent, LegendItem as CJLegendItem } from 'chart.js/auto';
import { isPieChart, isXYChart } from '../../../core/utils';
import { deepClone, fadeColor } from '../../../helpers';
import { ChartData, ChartEvent, ChartEventType, ChartOptions, EventContext, LegendItem } from '../../../types';
import type { Chart } from '../../.internal';

export class SegmentClickable<TChart extends Chart<ChartData, ChartOptions>> {
  public selectedSegment: LegendItem[] = [];

  private originBackgroundColors: (string | string[])[] = [];
  private originBorderColors?: (string | string[])[] = [];
  public setSegmentColors(backgroundColors: (string | string[])[], borderColors?: (string | string[])[]): void {
    this.originBackgroundColors = backgroundColors;
    this.originBorderColors = borderColors;
  }

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
    // TODO(yiwei): apply onClick for xy chart
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
    this.selectedSegment = deepClone(this.chart.legend?.selectedItems as LegendItem[]);
    if (this.selectedSegment.length === 0) {
      this.chart.api?.data.datasets.forEach((dataset, index) => {
        if (this.originBackgroundColors) {
          dataset.backgroundColor = this.originBackgroundColors[index];
        }
        if (this.originBorderColors) {
          dataset.borderColor = this.originBorderColors[index];
        }
      });
    }
    if (!this.chart.api?.data.datasets || this.chart.api.data.datasets.length === 0) {
      return;
    }

    if (manualTrigger) {
      this.chart.api?.update();
    }
  }

  public toCJPlugin(): any {
    return {
      id: 'segmentClickable',
      beforeUpdate: (chart: CJ): void => {
        const data = chart.config.data;
        if (!data?.datasets?.length || this.selectedSegment.length === 0 || this.originBackgroundColors.length === 0) {
          return;
        }
        data.datasets.forEach((dataset, datasetIndex) => {
          const metaData = chart.getDatasetMeta(datasetIndex);
          const originBackgroundColor = this.originBackgroundColors[datasetIndex];
          if (!originBackgroundColor || originBackgroundColor.length === 0) {
            return;
          }

          if (isPieChart(metaData.type)) {
            if (typeof originBackgroundColor !== 'string') {
              const result = originBackgroundColor.map((color: string, index: number) => {
                if (this.selectedSegment?.some((selected: LegendItem) => selected.index === index)) {
                  return color;
                } else {
                  return fadeColor(color) as string | undefined;
                }
              });
              dataset.backgroundColor = result;
            }
          } else if (isXYChart(metaData.type)) {
            if (originBackgroundColor) {
              dataset.backgroundColor = this.selectedSegment?.some(
                (selected: LegendItem) => selected.text === metaData.label,
              )
                ? originBackgroundColor
                : fadeColor(originBackgroundColor);
            }
            if (this.originBorderColors) {
              const originBorderColor = this.originBorderColors[datasetIndex];
              dataset.borderColor = this.selectedSegment?.some(
                (selected: LegendItem) => selected.text === metaData.label,
              )
                ? originBorderColor
                : fadeColor(originBorderColor);
            }
          }
        });
      },
    };
  }
}
