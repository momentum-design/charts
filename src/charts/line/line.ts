import { ChartDataset } from 'chart.js/auto';
import { alphaColor } from '../../helpers';
import { ChartType, TableData } from '../../types';
import { XYChart } from '../xy';
import { SeriesStyleOptions } from '../xy/xy.types';

export class LineChart extends XYChart {
  getType(): ChartType {
    return ChartType.Line;
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
      options?.styleOptions?.type &&
      (options.styleOptions.type === ChartType.Area || options.styleOptions.type === 'dashedArea')
    ) {
      const stacked = this.options?.valueAxes?.[options.styleOptions?.valueAxisIndex ?? 0].stacked;
      dataset.fill = {
        below: alphaColor(options.color, 0.4),
        above: alphaColor(options.color, 0.4),
        target: stacked ? 'stack' : 'origin',
      };
    }
    return dataset;
  }
}
