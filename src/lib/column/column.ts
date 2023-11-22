import { ChartDataset } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { ChartType, TableData } from '../../types';
import { XYChart } from '../xy';

export class ColumnChart extends XYChart {
  getType(): ChartType {
    return ChartType.Column;
  }
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }
  protected afterDatasetCreated(dataset: ChartDataset<'bar', number[]>): ChartDataset<'bar', number[]> {
    dataset.maxBarThickness = 30;
    return dataset;
  }
}
