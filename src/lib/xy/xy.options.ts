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
    position: 'bottom',
    display: true,
    isLegendClick: false,
  },
};

export { defaultXYChartOptions };
