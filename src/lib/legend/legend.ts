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
          //TODO(yiwei): replace label color with plugin mode
          labels.map((label) => {
            if (this.selectedItems.find((item) => item.text === label.text)?.selected) {
              label.fontColor = '#000';
            }
          });
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
}
