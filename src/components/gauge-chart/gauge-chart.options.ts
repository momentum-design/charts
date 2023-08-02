import { GaugeChartData, GaugeChartOptions } from './gauge-chart.types';

const gaugeChartData: GaugeChartData = {
  data: [],
  value: 0,
};

const defaultGaugeChartOptions: GaugeChartOptions = {
  responsive: true,
  aspectRatio: 1.6,
  cutout: '90%',
  circumference: 180,
  rotation: 270,
  paddingLeft: 30,
  paddingRight: 30,
  legendDisplay: false,
};

export { defaultGaugeChartOptions, gaugeChartData };
