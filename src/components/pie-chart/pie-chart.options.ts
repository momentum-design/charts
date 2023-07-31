import { legendClickHandler } from '../../core/plugins';
import { PieChartData, PieChartOptions } from './pie-chart.types';

const pieChartData: PieChartData = {
  data: [],
  label: 'Dataset',
};

const defaultPieChartOptions: PieChartOptions = {
  responsive: true,
  cutout: '0',
  theme: 'color-health',
  aspectRatio: 1.6,
  plugins: {
    legend: {
      display: true,
      position: 'right',
      onClick: legendClickHandler,
    },
  },
  isLegendFilter: false,
  legendFilterCallback: undefined,
};

export { pieChartData, defaultPieChartOptions };
