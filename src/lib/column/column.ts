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
}
