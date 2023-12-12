import {
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
  selectedItems: LegendItem[] = [];

  constructor(public chart: TChart) {}

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
      labels: {
        usePointStyle: true,
        pointStyle: chartOptions.legend?.markerStyle,
        generateLabels: (chart: CJ<CJChartType>) => {
          let gl = CJ.defaults.plugins.legend.labels.generateLabels;
          if (typeof opts?.generateLabels === 'function') {
            gl = opts?.generateLabels;
          }
          const labels = gl(chart);
          if (!this.chart.options.legend?.selectable) {
            labels.map((label) => {
              const item = this.toLegendItem(label);

              if (label.hidden) {
                this.setItemInactiveStyle(item);
                label.hidden = false;
                label.fontColor = inactiveColor;
              } else {
                this.setItemActiveStyle(item);
              }
            });
          }
          return opts?.overwriteLabels ? opts.overwriteLabels(labels, chart) : labels;
        },
      },
      onClick: (cjEvent: CJChartEvent, cjLegendItem: CJLegendItem, cjLegend: CJLegendElement<CJChartType>) => {
        const canBeSelected = this.chart.options.legend?.selectable;
        const legendItem: LegendItem = {
          text: cjLegendItem.text,
          color: cjLegendItem.fillStyle as string,
          index: cjLegendItem.index,
          hidden: cjLegendItem.hidden,
          selected: canBeSelected
            ? !this.selectedItems.find((item) => item.text === cjLegendItem.text)?.selected
            : undefined,
        };

        if (canBeSelected) {
          const index = this.selectedItems.findIndex((item) => item.text === legendItem.text);
          if (index >= 0) {
            this.selectedItems.splice(index, 1);
          }
          if (legendItem.selected) {
            this.selectedItems.push(legendItem);
          }
          this.setItemSelectedStyle(legendItem, cjLegend);
        }

        if (typeof opts?.onItemClick === 'function') {
          opts.onItemClick(this.chart, cjLegendItem);
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
      selected: canBeSelected
        ? !this.selectedItems.find((item) => item.text === cjLegendItem.text)?.selected
        : undefined,
    };
    return legendItem;
  }

  private setItemSelectedStyle(legendItem: LegendItem, cjLegend: CJLegendElement<CJChartType>): void {
    const index = cjLegend.legendItems?.findIndex((item) => item.text === legendItem.text);
    let focusBox = cjLegend.chart.canvas.parentElement?.querySelector('#legend-index-' + index);
    if (legendItem.selected) {
      if (!focusBox) {
        focusBox = document.createElement('div');
        focusBox.setAttribute('id', 'legend-index-' + index);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { left, top, width, height } = cjLegend.legendHitBoxes[index];
      const newLeft = `${left - 7}px`;
      const newTop = `${top - 3}px`;
      const newWidth = `${width + 14}px`;
      const newHeight = `${height + 6}px`;
      focusBox.setAttribute(
        'style',
        `pointer-events:none;position:absolute; background-color:#2b2b2b1a; border-radius: 10px;left: ${newLeft}; top:${newTop}; width:${newWidth}; height:${newHeight}`,
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      focusBox.setAttribute('aria-label', `${legendItem.text}, ${index + 1} of ${cjLegend.legendHitBoxes.length}`);
      cjLegend.chart.canvas.insertAdjacentElement('afterend', focusBox);
    } else {
      focusBox?.remove();
    }
  }
}
