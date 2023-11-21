import { XYChartOptions } from './xy.types';

const defaultXYChartOptions: XYChartOptions = {
  categoryAxis: {
    gridDisplay: true,
    display: true,
    stacked: false,
  },
  valueAxes: [
    {
      gridDisplay: true,
      display: true,
      stacked: false,
    },
  ],
  legend: {
    position: 'bottom',
    display: true,
  },
};

export { defaultXYChartOptions };
