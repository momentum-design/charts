import { ChartOptions } from '../types';

const defaultChartOptions: ChartOptions = {
  chartLabel: '',
  aspectRatio: 1.6,
  legend: {},
  tooltip: {
    isMultipleLegend: false,
    isMultipleSeries: false,
    seriesTooltipFloor: 2,
    legendTooltipFloor: 2,
  },
};

export { defaultChartOptions };
