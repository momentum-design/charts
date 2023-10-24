import { XYChartOptions } from './xy-chart.types';

const defaultXYChartOptions: XYChartOptions = {
  categoryAxis: {
    gridDisplay: true,
    display: true,
    stacked: false,
    dataKey: '',
  },
  valueAxis: {
    gridDisplay: true,
    display: true,
    stacked: false,
  },
  legend: {
    legendPosition: 'bottom',
    legendDisplay: true,
    isLegendClick: false,
  },
};

export { defaultXYChartOptions };
