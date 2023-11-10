import { Chart as ChartJS } from 'chart.js/auto';
import { merge } from 'lodash-es';
import { ChartContainer, ChartData, ChartOptions, TableData } from '../../types';

export abstract class Chart<TData extends ChartData, TOptions extends ChartOptions> {
  api?: ChartJS;

  private _options: TOptions;

  get options(): TOptions {
    return this._options;
  }

  constructor(protected data: TData, options?: TOptions) {
    this._options = merge(this.getDefaultOptions(), options);
  }

  render(container: ChartContainer): void {
    this.api = new ChartJS(container, this.getConfiguration());
  }

  resize(): void {
    this.api?.resize();
  }

  update(): void {
    this.api?.update();
  }

  abstract getTableData(): TableData;

  protected abstract getConfiguration(): any;
  protected abstract getDefaultOptions(): TOptions;
}
