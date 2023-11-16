import { ChartDataset } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { transparentizeColor } from '../../core/utils';
import { ChartType, TableData } from '../../types';
import { XYChart } from '../xy';

export class RangeChart extends XYChart {
  getType(): ChartType {
    return ChartType.Range;
  }
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }

  protected afterDatasetCreated(
    dataset: ChartDataset<'line', number[]>,
    seriesOptions: { styleMapping: { type: string } },
    color: string,
    index: number,
  ): ChartDataset<'line', number[]> {
    if (this.chartData?.series && index === this.chartData.series.length - 1) {
      dataset.fill = {
        below: transparentizeColor(color, 0.4),
        above: transparentizeColor(color, 0.4),
        target: '-1',
      };
    }
    return dataset;
  }
}
