import { ChartDataset, ChartTypeRegistry } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { ChartTypeEnum, TableData } from '../../types';
import { XYChart } from '../xy';

export class ColumnChart extends XYChart {
  getType(): ChartTypeEnum {
    return ChartTypeEnum.Column;
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
