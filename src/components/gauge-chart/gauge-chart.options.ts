import { GaugeChartOptions } from './gauge-chart.types';

const defaultGaugeChartOptions: GaugeChartOptions = {
  value: 0,
  fontColor: '#000',
  fontFamily: 'Helvetica',
  aspectRatio: 1.6,
  cutout: '90%',
  circumference: 180,
  rotation: 270,
  padding: {
    left: 30,
    right: 30,
  },
  legend: {
    display: false,
  },
};

export { defaultGaugeChartOptions };
