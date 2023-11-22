import { ChartDataset } from 'chart.js/auto';
import 'chartjs-adapter-moment';
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
    seriesOptions: { styleOptions?: SeriesStyleOptions },
    color: string,
    index: number,
  ): ChartDataset<'line', number[]> {
    if (this.chartData?.series && index === this.chartData.series.length - 1) {
      dataset.fill = {
        below: alphaColor(color, 0.4),
        above: alphaColor(color, 0.4),
        target: '-1',
      };
    }
    return dataset;
  }
}
