import {
  ActiveElement,
  Chart as CJ,
  ChartEvent as CJChartEvent,
  ChartType as CJChartType,
  LegendElement as CJLegendElement,
  LegendItem as CJLegendItem,
  LegendOptions as CJLegendOptions,
} from 'chart.js/auto';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import {
  ChartData,
  ChartEvent,
  ChartEventType,
  ChartOptions,
  EventContext,
  inactiveColor,
  LegendItem,
} from '../../types';
import { Chart } from '../.internal';

export class Legend<TChart extends Chart<ChartData, ChartOptions>> {
  items: LegendItem[] = [];

  selectedSeries: LegendItem[] = [];

  get selectedItems(): LegendItem[] {
    return this.items.filter((item) => item.selected);
  }

  constructor(public chart: TChart) {}

  onSeriesClick(cjEvent: CJChartEvent, elements: ActiveElement[], chart: any): void {
    if (!elements || !elements.length || !this.chart.options.seriesSelectable) return;
    // TODO: element.index is Pie chart attribute.
    const clickedSeriesIndex: number[] = elements.map((element: ActiveElement) => element.index);

    const cjLegendItem: CJLegendItem = {
      text: (chart.data.labels && chart.data.labels[clickedSeriesIndex[0]]) as string,
      index: clickedSeriesIndex[0],
    };
    chart.legend?.options?.onClick(cjEvent, cjLegendItem, 'onClick');

    const eventContext: EventContext<LegendItem[]> = {
      chart: this.chart,
      data: this.selectedSeries,
      event: cjEvent,
    };
    const evt = new ChartEvent(ChartEventType.SeriesItemClick, eventContext);
    this.chart.rootElement?.dispatchEvent(evt);
  }

  setSelectedSeriesData(selectedIndex: number): void {
    const isSelected = this.selectedSeries.find((selected) => selected.index === selectedIndex);
    if (isSelected) {
      this.selectedSeries = this.selectedSeries.filter((selected) => selected.index !== selectedIndex);
    } else {
      const selectItem = {
        text: (this.chart.api?.data.labels && this.chart.api.data.labels[selectedIndex]) as string,
        index: selectedIndex,
      };
      this.selectedSeries.push(selectItem);
    }

    this.setSelectSeriesStatus(this.selectedSeries);
  }

  setSelectSeriesStatus(selectedSeries: LegendItem[], manualTrigger = false): void {
    const metaData = this.chart.api?.getDatasetMeta(0);
    if (metaData) {
      metaData.data.forEach((item, index: number) => {
        item.active = Boolean(selectedSeries?.find((selected) => selected.index === index));
      });
    }

    if (manualTrigger) {
      this.selectedSeries = this.selectedSeries.filter((selectedItem) =>
        this.selectedItems.find((item) => item.index === selectedItem.index),
      );
      this.chart.api?.update();
    }
  }

  changeSelectedItems(items: LegendItem[]): void {
    const itemsChangedToSelect = items.filter((item) => !this.selectedItems.find((si) => si.text === item.text));
    const itemsChangedToUnselect = this.selectedItems.filter((item) => !items.find((si) => si.text === item.text));

    itemsChangedToSelect.forEach((si) => {
      this.selectItem(si);
    });
    itemsChangedToUnselect.forEach((usi) => {
      this.unselectItem(usi);
    });

    this.chart.segmentClick?.setSegmentStatus(true);
  }

  setItemInactiveStyle(item: LegendItem): void {
    if (this.chart.options?.legend?.states?.setItemInactiveStyle) {
      this.chart.options.legend.states.setItemInactiveStyle(item);
    }
  }

  setItemActiveStyle(item: LegendItem): void {
    if (this.chart?.options?.legend?.states?.setItemActiveStyle) {
      this.chart.options.legend.states.setItemActiveStyle(item);
    }
  }

  getChartJSConfiguration(opts?: {
    generateLabels?: (chart: CJ<CJChartType>) => CJLegendItem[];
    overwriteLabels?: (labels: CJLegendItem[], chart: CJ<CJChartType>) => CJLegendItem[];
    onItemClick?: (chart: TChart, legendItem: CJLegendItem) => void;
  }): _DeepPartialObject<CJLegendOptions<CJChartType>> {
    const chartOptions = this.chart.options;
    return {
      display: chartOptions.legend?.display ?? true,
      position: chartOptions.legend?.position ?? 'top',
      reverse: chartOptions.legend?.reverse ?? false,
      labels: {
        usePointStyle: true,
        pointStyle: chartOptions.legend?.markerStyle,
        font: { size: 12 },
        generateLabels: (chart: CJ<CJChartType>) => {
          let gl = CJ.defaults.plugins.legend.labels.generateLabels;
          if (typeof opts?.generateLabels === 'function') {
            gl = opts?.generateLabels;
          }
          const labels = gl(chart);
          labels.forEach((label) => {
            const legendItem = this.toLegendItem(label);
            if (!this.items.find((item) => item.text === legendItem.text)) {
              this.items.push(legendItem);
            }
            if (!this.chart.options.legend?.selectable) {
              if (label.hidden) {
                this.setItemInactiveStyle(legendItem);
                label.hidden = false;
                label.fontColor = inactiveColor;
              } else {
                this.setItemActiveStyle(legendItem);
              }
            }
          });

          return opts?.overwriteLabels ? opts.overwriteLabels(labels, chart) : labels;
        },
      },
      onClick: (cjEvent: CJChartEvent, cjLegendItem: CJLegendItem, _cjLegend: CJLegendElement<CJChartType>) => {
        const canBeSelected = this.chart.options.legend?.selectable;
        let legendItem = this.items.find((item) => item.text === cjLegendItem.text);
        if (!legendItem) {
          legendItem = this.toLegendItem(cjLegendItem);
          this.items.push(legendItem);
        }

        if (canBeSelected) {
          if (legendItem?.selected) {
            this.unselectItem(legendItem);
          } else {
            this.selectItem(legendItem);
          }
          this.chart.segmentClick?.setSegmentStatus();
        }

        if (chartOptions.seriesSelectable) {
          this.setSelectedSeriesData(legendItem.index as number);
        }

        if (typeof opts?.onItemClick === 'function') {
          opts.onItemClick(this.chart, cjLegendItem); // TODO(bing): check if it should be cjLegendItem
        }

        const eventContext: EventContext<LegendItem> = {
          chart: this.chart,
          data: legendItem,
          event: cjEvent,
        };
        const evt = new ChartEvent(ChartEventType.LegendItemClick, eventContext);

        if (this.chart.options.legend?.onItemClick) {
          this.chart.options.legend.onItemClick(evt);
        }
        this.chart.rootElement?.dispatchEvent(evt);
      },
    };
  }

  private toLegendItem(cjLegendItem: CJLegendItem): LegendItem {
    const canBeSelected = this.chart.options.legend?.selectable;
    const legendItem: LegendItem = {
      text: cjLegendItem.text,
      color: cjLegendItem.fillStyle as string,
      index: cjLegendItem.index,
      hidden: cjLegendItem.hidden,
      selected: canBeSelected ? this.items.find((item) => item.text === cjLegendItem.text)?.selected : undefined,
    };
    return legendItem;
  }

  private setItemSelectedStyle(legendItem: LegendItem): void {
    const cjLegend = this.chart.api?.legend;
    if (!cjLegend) {
      return;
    }

    const index = cjLegend.legendItems?.findIndex((item) => item.text === legendItem.text);
    let focusBox = cjLegend.chart.canvas.parentElement?.querySelector('#legend-index-' + index);
    if (!cjLegend.chart.canvas.parentElement) {
      return;
    }
    if (legendItem.selected) {
      if (!focusBox) {
        focusBox = document.createElement('div');
        focusBox.setAttribute('id', 'legend-index-' + index);
      }
      const canvasRect = cjLegend.chart.canvas.getBoundingClientRect();
      const parentRect = cjLegend.chart.canvas.parentElement?.getBoundingClientRect();
      const leftOffset = canvasRect.left - parentRect.left;
      const topOffset = canvasRect.top - parentRect.top;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { left, top, width, height } = cjLegend.legendHitBoxes[index];
      const newLeft = `${left - 7 + leftOffset}px`;
      const newTop = `${top - 4 + topOffset}px`;
      const newWidth = `${width + 14}px`;
      const newHeight = `${height + 8}px`;
      focusBox.setAttribute(
        'style',
        `left:${newLeft};top:${newTop};width:${newWidth};height:${newHeight};background-color:#2b2b2b1a;pointer-events:none;position:absolute;border-radius:10px;`,
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      focusBox.setAttribute('aria-label', `${legendItem.text}, ${index + 1} of ${cjLegend.legendHitBoxes.length}`);
      cjLegend.chart.canvas.insertAdjacentElement('afterend', focusBox);
    } else {
      focusBox?.remove();
    }
  }

  public resetSelectedLegendItems(): void {
    this.selectedItems.forEach((legendItem) => {
      this.resetStylesForSelectedItem(legendItem);
    });
  }

  public selectItem(item: LegendItem): void {
    item.selected = true;
    this.setItemSelectedStyle(item);
  }

  public unselectItem(item: LegendItem): void {
    item.selected = false;
    const legendItem = this.items.find((it) => it.text === item.text);
    if (legendItem) {
      legendItem.selected = false;
    }
    this.removeBackgroundForSelectedItem(item);
  }

  private resetStylesForSelectedItem(legendItem: LegendItem): void {
    const cjLegend = this.chart.api?.legend;
    if (cjLegend) {
      this.removeBackgroundForSelectedItem(legendItem);
      this.setItemSelectedStyle(legendItem);
    }
  }

  private removeBackgroundForSelectedItem(legendItem: LegendItem): boolean {
    const cjLegend = this.chart.api?.legend;
    if (cjLegend) {
      const index = this.chart.api?.legend?.legendItems?.findIndex((item) => item.text === legendItem.text);
      const elemBackground = cjLegend.chart.canvas.parentElement?.querySelector('#legend-index-' + index);
      if (elemBackground) {
        elemBackground.remove();
        return true;
      }
    }

    return false;
  }
}
