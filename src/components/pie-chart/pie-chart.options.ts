import { legendClickHandler } from '../../core/plugins';
import { PieChartData, PieChartOptions } from './pie-chart.types';

const pieChartData: PieChartData = {
  data: [],
  label: '',
  centerValue: '',
};

const defaultPieChartOptions: PieChartOptions = {
  type: 'pie',
  responsive: true,
  cutout: '0',
  theme: 'color-health',
  aspectRatio: 2,
  plugins: {
    legend: {
      display: true,
      position: 'right',
      onClick: legendClickHandler,
    },
  },
  isLegendClick: false,
  legendClickCallback: undefined,
};

export { pieChartData, defaultPieChartOptions };
