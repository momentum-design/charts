import { ChartData, ChartOptions, ChartType } from '../types';
import { Chart } from './.internal';
import { AreaChart } from './area';
import { BarChart } from './bar';
import { ColumnChart } from './column';
import { LineChart } from './line';
import { RangeChart } from './range';
import { WordCloudChart } from './word-cloud';

export const SUPPORTED_CHARTS = new Map<ChartType, typeof Chart<ChartData, ChartOptions>>([
  [ChartType.WordCloud, WordCloudChart],
  [ChartType.Bar, BarChart],
  [ChartType.Column, ColumnChart],
  [ChartType.Line, LineChart],
  [ChartType.Area, AreaChart],
  [ChartType.Range, RangeChart],
]);

export function createChart(
  chartType: ChartType,
  chartData: ChartData,
  chartOptions?: ChartOptions,
): Chart<ChartData, ChartOptions> {
  const ctor = SUPPORTED_CHARTS.get(chartType) as new (data: ChartData, options?: ChartOptions) => Chart<
    ChartData,
    ChartOptions
  >;

  if (ctor) {
    return new ctor(chartData, chartOptions);
  }

  throw new Error(`Invalid chart type ${chartType}.`);
}
