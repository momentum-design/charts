import { PieChartOptions } from './pie-chart.types';

const defaultPieChartOptions: PieChartOptions = {
  centerLabel: '',
  chartLabel: '',
  cutout: '0',
  aspectRatio: 2,
  legend: {
    position: 'right',
    display: true,
    isLegendClick: false,
  },
};

export { defaultPieChartOptions };
