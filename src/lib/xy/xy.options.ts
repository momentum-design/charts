import { XYChartOptions } from './xy.types';

const defaultXYChartOptions: XYChartOptions = {
  categoryAxis: {
    gridDisplay: true,
    display: true,
    stacked: false,
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
