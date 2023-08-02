import { PieChartData, PieChartOptions } from './pie-chart.types';

const pieChartData: PieChartData = {
  data: [],
  label: '',
  centerLabel: '',
};

const defaultPieChartOptions: PieChartOptions = {
  responsive: true,
  cutout: '0',
  theme: 'color-health',
  aspectRatio: 2,
  legendPosition: 'right',
  legendDisplay: true,
  isLegendClick: false,
};

export { pieChartData, defaultPieChartOptions };
