import { ChartDataset, Color } from 'chart.js/auto';
import { fadeColor } from '../../helpers';
import { ChartType, TableData } from '../../types';
import { XYChart } from '../xy';
import { SeriesStyleOptions } from '../xy/xy.types';

export class AreaChart extends XYChart {
  getType(): ChartType {
    return ChartType.Area;
  }
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }
  protected afterDatasetCreated(
    dataset: ChartDataset<'line', number[]>,
    options: {
      styleOptions?: SeriesStyleOptions;
      color: string;
    },
  ): ChartDataset<'line', number[]> {
    if (
      !options?.styleOptions?.type ||
      options.styleOptions.type === ChartType.Area ||
      options.styleOptions.type === 'dashedArea'
    ) {
      const stacked = this.options?.valueAxes?.[options.styleOptions?.valueAxisIndex ?? 0].stacked;
      dataset.fill = {
        below: fadeColor(options.color) as Color,
        above: fadeColor(options.color) as Color,
        target: stacked ? 'stack' : 'origin',
      };
    }
    return dataset;
  }
}
