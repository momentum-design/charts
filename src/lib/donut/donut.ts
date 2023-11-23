import { ChartConfiguration, ChartOptions } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { ChartType } from '../../types';
import { PieChart } from '../pie';
import { centerLabel } from './donut.plugin';
import { DonutData, DonutOptions } from './donut.type';
export class DonutChart extends PieChart<DonutData, DonutOptions> {
  static readonly donutOptions: DonutOptions = {
    legend: {
      position: 'right',
    },
    donutLabel: {
      enable: true,
    },
  };

  getType(): ChartType {
    return ChartType.Donut;
  }

  protected getConfiguration(): ChartConfiguration {
    let donutConfig = super.getConfiguration();
    donutConfig?.plugins?.push(centerLabel(this.options.donutLabel));
    return donutConfig;
  }

  protected getDefaultOptions(): DonutOptions {
    return DonutChart.defaultOptions;
  }

  protected afterOptionsCreated(options: ChartOptions): ChartOptions {
    const _options = options as ChartOptions<'doughnut'>;
    _options.cutout = this.options.cutout;
    return _options as ChartOptions;
  }
}
