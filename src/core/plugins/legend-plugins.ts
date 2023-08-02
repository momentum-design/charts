/* eslint-disable */
import { ChartEvent, LegendItem } from 'chart.js/auto';

const legendClickHandler = (evt: ChartEvent, item: LegendItem, legend: any): void => {
  // TODO: support Filter Click
  if (legend.chart.config.options?.isLegendClick) {
    if (['pie', 'doughnut'].includes(legend.chart.config.type)) {
      const index = item.index;
      const legendObj = {
        key: item.text,
        value: legend.chart.config.data.datasets[0].data[index as number],
      };
      legend.chart.config.options.onLegendClick(legendObj);
    }
  } else {
    if (['pie', 'doughnut'].includes(legend.chart.config.type)) {
      const index = item.index;
      const chart = legend.chart;
      chart.toggleDataVisibility(index);
      chart.update();
    }
  }
};

export { legendClickHandler };
