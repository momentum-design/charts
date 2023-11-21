import { ChartDataset } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { alphaColor } from '../../helpers';
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
    seriesOptions: {
      styleOptions?: SeriesStyleOptions;
    },
    color: string,
  ): ChartDataset<'line', number[]> {
    if (!seriesOptions?.styleOptions?.type || seriesOptions?.styleOptions?.type === ChartType.Area) {
      dataset.fill = {
        below: alphaColor(color, 0.4),
        above: alphaColor(color, 0.4),
        target: 'start',
      };
    }
    return dataset;
  }
}
