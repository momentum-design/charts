import { ChartOptions } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { ChartType } from '../../types';
import { PieChart } from '../pie';
export class DoughnutChart extends PieChart {
  getType(): ChartType {
    return ChartType.Doughnut;
  }

  protected afterOptionsCreated(options: ChartOptions): ChartOptions {
    const _options = options as ChartOptions<'doughnut'>;
    _options.cutout = this.options.cutout;
    return _options as ChartOptions;
  }
}
