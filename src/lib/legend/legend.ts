import {
  Chart as CJ,
  ChartEvent as CJChartEvent,
  ChartType as CJChartType,
  LegendElement as CJLegendElement,
  LegendItem as CJLegendItem,
  LegendOptions as CJLegendOptions,
} from 'chart.js/auto';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { ChartData, ChartEvent, ChartEventType, ChartOptions, EventContext, LegendItem } from '../../types';
import { Chart } from '../.internal';

export class Legend<TChart extends Chart<ChartData, ChartOptions>> {
  selectedItems: LegendItem[] = [];

  constructor(public chart: TChart) {}

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
          this.setLegendSelectedStyle(legendItem, cjLegend);
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

  private setLegendSelectedStyle(legendItem: LegendItem, cjLegend: CJLegendElement<CJChartType>): void {
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
      const newLeft = `${left - 10}px`;
      const newTop = `${top - 4}px`;
      const newWidth = `${width + 20}px`;
      const newHeight = `${height + 8}px`;
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
