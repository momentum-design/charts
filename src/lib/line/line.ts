import { ChartDataset } from 'chart.js/auto';
import 'chartjs-adapter-moment';
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
    if (options?.styleOptions?.type && options?.styleOptions?.type === ChartType.Area) {
      dataset.fill = {
        below: alphaColor(options.color, 0.4),
        above: alphaColor(options.color, 0.4),
        target: 'start',
      };
    }
    return dataset;
  }
}
