import { ChartDataset, ChartTypeRegistry } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { ChartType, TableData } from '../../types';
import { XYChart } from '../xy';

export class BarChart extends XYChart {
  getType(): ChartType {
    return ChartType.Bar;
  }
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }
  protected afterDatasetCreated(
    dataset: ChartDataset<keyof ChartTypeRegistry, number[]>,
  ): ChartDataset<keyof ChartTypeRegistry, number[]> {
    return dataset;
  }
}
