import { Chart, ChartDataset, ChartEvent, ChartType, LegendElement, LegendItem, LegendOptions } from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { ChartOptions, LegendItemOptions } from '../../types';

const legendClickHandler = function (
  legendItem: LegendItem,
  legend: LegendElement<ChartType>,
  selectedLegends?: LegendItemOptions[],
  callback?: (legends: LegendItemOptions[]) => void,
): void {
  let legendObj: LegendItemOptions = {};
  legendObj = {
    label: legendItem.text,
    value: legendItem.text,
  };
  const legends = selectedLegends ?? [];
  const legendIndex = legends?.findIndex((data: LegendItemOptions) => data.label === legendItem.text);
  if (legendIndex !== -1) {
    legends.splice(legendIndex, 1);
  } else {
    legends.push(legendObj);
  }
  if (callback) callback(legends);
};

const initLegendOptions = function <TOptions extends ChartOptions>(
  type: ChartType,
  options: TOptions,
  selectedLegends?: LegendItemOptions[],
): _DeepPartialObject<LegendOptions<ChartType>> {
  return {
    display: options.legend?.display ?? true,
    position: options.legend?.position ?? 'top',
    labels: {
      pointStyle: 'rectRounded',
      usePointStyle: true,
      generateLabels(chart: Chart<ChartType>) {
        let labels;
        if (type === 'pie' || type === 'doughnut') {
          labels = Chart.overrides.pie.plugins.legend.labels.generateLabels;
        } else {
          labels = Chart.defaults.plugins.legend.labels.generateLabels;
        }
        return labels(chart).map((data) => {
          let dataset = chart.data.datasets.find((dataset) => dataset.label === data.text);
          if (dataset?.type === 'line') {
            data.pointStyle = 'line';
            dataset = dataset as ChartDataset<'line', number[]>;
            if (dataset.borderDash) {
              data.lineDash = [3, 3];
            }
          }
          return data;
        });
      },
    },
    onClick: (e: ChartEvent, legendItem: LegendItem, legend: LegendElement<ChartType>) => {
      onLegendClick(legendItem, legend, options, selectedLegends);
    },
  };
};

const onLegendClick = function <TOptions extends ChartOptions>(
  item: LegendItem,
  legend: LegendElement<ChartType>,
  options: TOptions,
  selectedLegends?: LegendItemOptions[],
): void {
  if (options.legend?.onItemClick) {
    // TODO(yiwei): Implementation of callback
    legendClickHandler(item, legend, selectedLegends, options.legend?.onItemClick);
  } else {
    if (typeof item.datasetIndex !== 'undefined') {
      legend.chart?.setDatasetVisibility(item.datasetIndex, !legend.chart.isDatasetVisible(item.datasetIndex));
      legend.chart?.update();
    }
  }
};

export { initLegendOptions };
