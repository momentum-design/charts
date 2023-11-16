import { ChartDataset } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { transparentizeColor } from '../../core';
import { ChartType, TableData } from '../../types';
import { XYChart } from '../xy';

export class LineChart extends XYChart {
  getType(): ChartType {
    return ChartType.Line;
  }
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }

  protected afterDatasetCreated(
    dataset: ChartDataset<'line', number[]>,
    seriesOptions: { styleMapping: { type: string } },
    color: string,
  ): ChartDataset<'line', number[]> {
    if (seriesOptions?.styleMapping?.type && seriesOptions?.styleMapping?.type === ChartType.Area) {
      dataset.fill = {
        below: transparentizeColor(color, 0.4),
        above: transparentizeColor(color, 0.4),
        target: 'start',
      };
    }
    return dataset;
  }
}
