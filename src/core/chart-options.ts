import { ChartOptions } from '../types';

const defaultChartOptions: ChartOptions = {
  chartLabel: '',
  aspectRatio: 1.6,
  legend: {
    legendLabelsHeight: 12,
    legendLabelsWidth: 12,
    legendBorderRadius: 2,
  },
  tooltip: {
    isMultipleLegend: false,
    isMultipleSeries: false,
    seriesTooltipFloor: 2,
    legendTooltipFloor: 2,
  },
};

export { defaultChartOptions };
