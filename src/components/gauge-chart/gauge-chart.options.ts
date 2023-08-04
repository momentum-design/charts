import { GaugeChartOptions } from './gauge-chart.types';

const defaultGaugeChartOptions: GaugeChartOptions = {
  responsive: true,
  value: 0,
  aspectRatio: 1.6,
  cutout: '90%',
  circumference: 180,
  rotation: 270,
  paddingLeft: 30,
  paddingRight: 30,
  legendDisplay: false,
};

export { defaultGaugeChartOptions };
