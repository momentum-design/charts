import { ChartDataset, Color } from 'chart.js/auto';
import { fadeColor } from '../../helpers';
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
        below: fadeColor(options.color) as Color,
        above: fadeColor(options.color) as Color,
        target: '-1',
      };
    }
    return dataset;
  }
}
