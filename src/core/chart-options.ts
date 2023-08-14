import { ChartOptions } from '../types';

const chartOptions: ChartOptions = {
  responsive: true,
  chartLabel: '',
  fontColor: '#000',
  fontFamily: 'Helvetica',
  aspectRatio: 1.6,
  legend: {
    legendLabelsHeight: 12,
    legendLabelsWidth: 12,
  },
  tooltip: {
    isMultipleLegend: false,
    isMultipleSeries: false,
    seriesTooltipFloor: 2,
    legendTooltipFloor: 2,
  },
};

export { chartOptions };
