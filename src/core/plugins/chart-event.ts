/* eslint-disable */
import Chart, { ActiveElement, ChartEvent } from 'chart.js/auto';
import { LegendClickData } from './plugin.types';

const chartSeriesClick = (event: ChartEvent | any, elements: ActiveElement[] | any, chart: Chart | any): void => {
  const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

  if (points.length) {
    const firstPoint = points[0];
    const label = chart.data.labels[firstPoint.index];
    const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];

    if (chart.config.options?.isLegendClick) {
      if (['pie', 'doughnut'].includes(chart.config.type)) {
        const legendObj: LegendClickData = {
          label: label,
          value: value,
        };
        chart.config.options.onLegendClick(legendObj);
        firstPoint.element.options.offset = 15;
      }
    }
  }
};

export { chartSeriesClick };
