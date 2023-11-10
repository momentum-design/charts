import { ChartDataset } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { transparentizeColor } from '../../core/utils';
import { ChartTypeEnum, TableData } from '../../types';
import { XYChart } from '../xy';

export class RangeChart extends XYChart {
  getType(): ChartTypeEnum {
    return ChartTypeEnum.Range;
  }
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }

  protected afterDatasetCreated(
    dataset: ChartDataset<'line', number[]>,
    seriesOptions: { styleMapping: { type: string } },
    index: number,
  ): ChartDataset<'line', number[]> {
    const colors = this.options ? this.getBackgroundColor(this.options) ?? [] : [];
    const colorIndex = index % colors.length;
    let borderColor = '';
    if (Array.isArray(dataset.borderColor)) {
      borderColor = borderColor[colorIndex];
    } else {
      borderColor = dataset.borderColor as string;
    }
    if (this.chartData?.series && index === this.chartData.series.length - 1) {
      dataset.fill = {
        below: transparentizeColor(borderColor, 0.4),
        above: transparentizeColor(borderColor, 0.4),
        target: '-1',
      };
    }
    return dataset;
  }
}
