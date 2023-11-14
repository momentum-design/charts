import { ChartDataset } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { transparentizeColor } from '../../core/utils';
import { ChartType, TableData } from '../../types';
import { XYChart } from '../xy';

export class AreaChart extends XYChart {
  getType(): ChartType {
    return ChartType.Area;
  }
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }
  protected afterDatasetCreated(
    dataset: ChartDataset<'line', number[]>,
    seriesOptions: { styleMapping: { type: string } },
    index: number,
  ): ChartDataset<'line', number[]> {
    if (!seriesOptions?.styleMapping?.type || seriesOptions?.styleMapping?.type === ChartType.Area) {
      const colors = this.options ? this.getBackgroundColor(this.options) ?? [] : [];
      const colorIndex = index % colors.length;
      let borderColor = '';
      if (Array.isArray(dataset.borderColor)) {
        borderColor = borderColor[colorIndex];
      } else {
        borderColor = dataset.borderColor as string;
      }
      dataset.fill = {
        below: transparentizeColor(borderColor, 0.4),
        above: transparentizeColor(borderColor, 0.4),
        target: 'start',
      };
    }
    return dataset;
  }
}
