import { ChartDataset } from 'chart.js/auto';
import { alphaColor } from '../../helpers';
import { ChartType, TableData } from '../../types';
import { XYChart } from '../xy';
import { SeriesStyleOptions } from '../xy/xy.types';

export class RangeChart extends XYChart {
  getType(): ChartType {
    return ChartType.Range;
  }
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }

  protected afterDatasetCreated(
    dataset: ChartDataset<'line', number[]>,
    options: {
      styleOptions?: SeriesStyleOptions;
      color: string;
      index: number;
    },
  ): ChartDataset<'line', number[]> {
    if (this.chartData?.series && options.index === this.chartData.series.length - 1) {
      dataset.fill = {
        below: alphaColor(options.color, 0.4),
        above: alphaColor(options.color, 0.4),
        target: '-1',
      };
    }
    return dataset;
  }
}
