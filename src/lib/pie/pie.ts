import { ChartConfiguration, ChartDataset, ChartOptions, ChartType as ChartJSType } from 'chart.js/auto';
import { chartA11y, chartLegendA11y } from '../../core/plugins';
import { tableDataToJSON } from '../../helpers/data';
import { toChartJSType } from '../../helpers/utils';
import { ChartType, TableData } from '../../types';
import { Chart } from '../.internal';
import { initLegendOptions } from '../legend/legend';
import { DataView, GenericDataModel, PieData, PieOptions } from './pie.types';

export class PieChart<TData extends PieData, TOptions extends PieOptions> extends Chart<TData, TOptions> {
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }

  static readonly defaultOptions: PieOptions = {
    legend: {
      position: 'right',
    },
  };

  protected chartData: DataView = {
    category: {
      name: undefined,
      labels: undefined,
    },
    series: [],
  };

  private currentChartOptions: ChartOptions | undefined;

  protected getConfiguration(): ChartConfiguration {
    let chartLabels: unknown[] = [];
    let chartDatasets: ChartDataset<ChartJSType, number[]>[] = [];
    this.getChartData();
    if (this.chartData) {
      chartLabels = this.chartData.category.labels ?? [];
      chartDatasets = this.getDatasets();
      this.currentChartOptions = this.getChartOptions();
    }

    return {
      type: ChartType.Pie,
      data: {
        labels: chartLabels,
        datasets: chartDatasets,
      },
      options: this.currentChartOptions,
      plugins: [chartA11y, chartLegendA11y],
    };
  }

  protected getChartData(): void {
    let data: PieData = [];
    if (!this.data) {
      return;
    }
    try {
      if (this.data instanceof String) {
        data = JSON.parse(this.data as unknown as string) as PieData;
      } else if (this.data instanceof Array) {
        data = this.data;
      }

      if (data.length > 0) {
        const genericData = this.transformGenericData(data);
        this.chartData = this.genericToDataView(genericData);
      }
    } catch (e) {
      throw new Error(`Chart data format incorrect.`);
    }
  }

  private getDatasets(): ChartDataset<ChartJSType, number[]>[] {
    const chartDataset: ChartDataset<ChartJSType, number[]>[] = [];
    if (Array.isArray(this.chartData?.series)) {
      const chartBG = this.getColorsForKeys(this.chartData?.category?.labels as string[]);
      const colors: string[] = [];
      this.chartData?.series?.forEach((series) => {
        let dataset: ChartDataset<ChartJSType, number[]> = { data: [] };
        dataset = this.getChartDataset(series, chartBG);
        if (dataset) {
          chartDataset.push(dataset);
        }
      });
    }
    return chartDataset;
  }

  private getChartOptions(): ChartOptions {
    let options: ChartOptions = {
      plugins: {
        legend: initLegendOptions(toChartJSType(this.getType()), this.options),
      },
    };
    if (this.getType() !== ChartType.Pie) {
      options = this.afterOptionsCreated(options);
    }
    return options;
  }

  private transformGenericData(sourceData: PieData): GenericDataModel {
    const result: GenericDataModel = {
      dataKey: this.options.dataKey,
      data: [],
    };

    if (typeof sourceData[0] === 'object' && !Array.isArray(sourceData[0])) {
      const data = sourceData as Record<string, string | number>[];
      result.dataKey = result.dataKey ?? Object.keys(data[0])[0];
      result.data = data;
    } else if (Array.isArray(sourceData[0])) {
      const data = sourceData as unknown[][];
      result.dataKey = result.dataKey ?? (data[0][0] as string);
      result.data = tableDataToJSON(data);
    }

    return result;
  }

  private genericToDataView(data: GenericDataModel): DataView {
    const result: DataView = {
      category: {
        name: '',
        labels: [],
      },
      series: [],
    };

    if (!data?.dataKey) {
      return result;
    }

    result.category.labels = Object.keys(data.data[0]).filter((key) => key !== data.dataKey);
    const seriesData = data.data.map((_data) => {
      return {
        name: data.dataKey ? (_data[data.dataKey] as string) : '',
        data: result.category.labels?.map((key) => _data[key as string]) as number[],
      };
    });

    result.series = seriesData;
    return result;
  }

  protected getChartDataset(
    series: {
      name?: string;
      data?: number[];
    },
    chartBG: string[],
  ): ChartDataset<ChartJSType, number[]> {
    const dataset: ChartDataset<ChartJSType, number[]> = { data: [] };
    dataset.data = Object.values(series.data ?? []) as number[];
    dataset.label = series.name;
    dataset.type = ChartType.Pie;
    dataset.backgroundColor = chartBG;
    return dataset;
  }

  protected getType(): ChartType {
    return ChartType.Pie;
  }

  protected getDefaultOptions(): TOptions {
    return PieChart.defaultOptions as TOptions;
  }

  protected afterOptionsCreated(options: ChartOptions): ChartOptions {
    return options;
  }
}
