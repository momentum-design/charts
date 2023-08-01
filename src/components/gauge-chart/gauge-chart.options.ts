import { GaugeChartData, GaugeChartOptions } from './gauge-chart.types';

const gaugeChartData: GaugeChartData = {
  type: 'doughnut',
  borderWidth: 2,
  borderRadius: 5,
  data: [],
  value: 0,
};

const defaultGaugeChartOptions: GaugeChartOptions = {
  responsive: true,
  theme: 'color-health',
  aspectRatio: 1.6,
  cutout: '90%',
  circumference: 180,
  rotation: 270,
  layout: {
    padding: {
      left: 30,
      right: 30,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

export { defaultGaugeChartOptions, gaugeChartData };
