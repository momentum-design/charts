import { ChartData, ChartOptions, ChartTypeEnum } from '../types';
import { Chart } from './.internal';
import { WordCloudChart } from './word-cloud';

export const SUPPORTED_CHARTS: Map<ChartTypeEnum, typeof Chart<ChartData, ChartOptions>> = new Map([
  [ChartTypeEnum.WordCloud, WordCloudChart],
]);

export function createChart(
  chartType: ChartTypeEnum,
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
