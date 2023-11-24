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
}
