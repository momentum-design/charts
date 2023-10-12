import { XYChartOptions } from './xy-chart.types';

const defaultXYChartOptions: XYChartOptions = {
  xStacked: false,
  yStacked: false,
  xGridDisplay: true,
  yGridDisplay: true,
  legend: {
    legendPosition: 'bottom',
    legendDisplay: true,
    isLegendClick: false,
  },
};

export { defaultXYChartOptions };
