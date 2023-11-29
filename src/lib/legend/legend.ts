import {
  Chart as CJ,
  ChartEvent as CJChartEvent,
  ChartType as CJChartType,
  LegendElement as CJLegendElement,
  LegendItem as CJLegendItem,
  LegendOptions as CJLegendOptions,
} from 'chart.js/auto';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { ChartData, ChartOptions } from '../../types';
import { EventType, LegendItemClickContext } from '../../types/chart.event.types';
import { LegendItem } from '../../types/chart.legend.types';
import { Chart } from '../.internal';

export class Legend<TChart extends Chart<ChartData, ChartOptions>> {
  private selectedItems: LegendItem[] = [];

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
        pointStyle: 'rectRounded',
        usePointStyle: true,
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
        const canBeSelected = this.chart.options.legend?.itemSelectable;
        const legendItem: LegendItem = {
          text: cjLegendItem.text,
          color: cjLegendItem.fillStyle as string,
          isSelected: canBeSelected
            ? !this.selectedItems.find((item) => item.text === cjLegendItem.text)?.isSelected
            : undefined,
        };

        if (canBeSelected) {
          const index = this.selectedItems.findIndex((item) => item.text === legendItem.text);
          if (index >= 0) {
            this.selectedItems.splice(index, 1);
          }
          this.selectedItems.push(legendItem);
        }

        if (typeof opts?.onItemClick === 'function') {
          opts.onItemClick(this.chart, cjLegendItem);
        }

        const eventContext: LegendItemClickContext = {
          chart: this.chart,
          data: legendItem,
          event: cjEvent,
        };

        if (this.chart.options.legend?.onItemClick) {
          this.chart.options.legend.onItemClick(eventContext);
        }

        this.chart.rootElement?.dispatchEvent(
          new CustomEvent<LegendItemClickContext>(EventType.LegendItemClick, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: eventContext,
          }),
        );
      },
    };
  }
}
