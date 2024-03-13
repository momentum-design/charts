/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chart as CJ,
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartType as CJType,
  Color,
  TooltipModel as CJTooltipModel,
} from 'chart.js/auto';
import { merge } from 'lodash-es';
import { tableDataToJSON } from '../../helpers/data';
import { isNullOrUndefined, mergeObjects } from '../../helpers/utils';
import {
  ChartDataView,
  ChartType,
  CJUnknownChartType,
  GenericDataModel,
  inactiveColor,
  LegendItem,
  Position,
  TableData,
} from '../../types';
import { Chart } from '../.internal';
import { A11yChart } from '../.plugins/a11y/a11y-chart';
import { a11yLegend } from '../.plugins/a11y/a11y-legend';
import { Tooltip, TooltipItem } from '../tooltip';
import { PieChartOptions, PieData } from './pie.types';

export class PieChart<TData extends PieData, TOptions extends PieChartOptions> extends Chart<TData, TOptions> {
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }

  static readonly defaults: PieChartOptions = {
    legend: {
      position: Position.Right,
    },
    tooltip: {
      useNative: false,
      showPercentage: false,
    },
  };

  protected chartData: ChartDataView = {
    category: {
      name: undefined,
      labels: undefined,
    },
    series: [],
  };

  private currentChartOptions: ChartOptions | undefined;
  private hiddenDatasets: { label?: string; backgroundColor?: Color }[] = [];

  protected getConfiguration(): ChartConfiguration {
    let chartLabels: unknown[] = [];
    let chartDatasets: ChartDataset<CJType, number[]>[] = [];
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
      plugins: [
        new A11yChart().toCJPlugin(),
        a11yLegend,
        this.segmentClickable?.toCJPlugin(chartDatasets[0].backgroundColor as string | string[]),
      ],
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
      } else {
        data = this.data;
      }

      if (data) {
        const genericData = this.transformGenericData(data);
        this.chartData = this.genericToDataView(genericData);
      }
    } catch (e) {
      throw new Error(`Chart data format incorrect.`);
    }
  }

  private getDatasets(): ChartDataset<CJType, number[]>[] {
    const chartDataset: ChartDataset<CJType, number[]>[] = [];
    if (Array.isArray(this.chartData?.series)) {
      const chartBG = this.getColorsForKeys(this.chartData?.category?.labels as string[]);
      this.chartData?.series?.forEach((series) => {
        let dataset: ChartDataset<CJType, number[]> = { data: [] };
        dataset = this.getChartDataset(series, chartBG);
        if (dataset) {
          chartDataset.push(dataset);
        }
      });
    }
    return chartDataset;
  }

  private getChartOptions(): ChartOptions {
    this.options.legend = this.options.legend || {};
    this.options.legend.states = {
      setItemInactiveStyle: (legendItem): void => {
        return this.setItemInactiveStyle(legendItem);
      },
      setItemActiveStyle: (legendItem): void => {
        return this.setItemActiveStyle(legendItem);
      },
    };
    this.enableSegmentClickable();
    this.enableLegend();
    let options: ChartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      onClick: (event, elements, chart) => {
        this.segmentClickable?.onClick(event, elements, chart);
      },
      plugins: {
        legend: this.legend?.getChartJSConfiguration({
          generateLabels: CJ.overrides.pie.plugins.legend.labels.generateLabels,
          overwriteLabels: (labels) => {
            labels.map((label) => {
              if (this.options.legend?.markerStyle) {
                label.pointStyle = this.options.legend?.markerStyle;
                return label;
              }
              label.pointStyle = 'rectRounded';
              return label;
            });
            return labels;
          },
          onItemClick: (chart, legendItem) => {
            if (this.options.legend?.selectable) {
              chart.api?.update();
            } else {
              if (typeof legendItem.index !== 'undefined') {
                chart.api?.toggleDataVisibility(legendItem.index as number);
                chart.api?.update();
              }
            }
          },
        }),
        tooltip: this.getTooltip().toCJPlugin(),
      },
    };
    if (this.getType() !== ChartType.Pie) {
      options = this.afterOptionsCreated(options);
    }
    if (this.options.padding) {
      options.layout = merge({}, options.layout, { padding: this.options.padding });
    }

    return options;
  }

  private transformGenericData(sourceData: PieData): GenericDataModel {
    const result: GenericDataModel = {
      dataKey: this.options.dataKey,
      data: [],
    };

    if (!Array.isArray(sourceData)) {
      const data = [sourceData] as Record<string, string | number>[];
      result.dataKey = result.dataKey ?? '';
      result.data = data;
    } else if (typeof sourceData[0] === 'object' && !Array.isArray(sourceData[0])) {
      const data = sourceData as Record<string, string | number>[];
      result.dataKey = result.dataKey ?? '';
      result.data = data;
    } else if (Array.isArray(sourceData[0])) {
      const data = sourceData as unknown[][];
      result.dataKey = result.dataKey ?? '';
      result.data = tableDataToJSON(data);
    }
    return result;
  }

  private genericToDataView(data: GenericDataModel): ChartDataView {
    const result: ChartDataView = {
      category: {
        name: '',
        labels: [],
      },
      series: [],
    };

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
      data?: (number | null)[];
    },
    chartBG: string[],
  ): ChartDataset<CJType, number[]> {
    const dataset: ChartDataset<CJType, number[]> = { data: [] };
    dataset.data = Object.values(series.data ?? []) as number[];
    dataset.label = series.name;
    dataset.type = ChartType.Pie;
    dataset.backgroundColor = chartBG;
    dataset.borderWidth = 1;
    return dataset;
  }

  protected getType(): ChartType {
    return ChartType.Pie;
  }

  protected getDefaultOptions(): TOptions {
    return PieChart.defaults as TOptions;
  }

  protected afterOptionsCreated(options: ChartOptions): ChartOptions {
    return options;
  }

  private setItemInactiveStyle(legend: LegendItem): void {
    const datasets = this.api?.data.datasets;
    if (!datasets) {
      return;
    }
    const index = legend.index ?? -1;
    if (index < 0) {
      return;
    }
    this.hiddenDatasets.push({
      label: legend.text,
      backgroundColor: (datasets[0].backgroundColor as Color[])[index],
    });
    datasets.map((dataset) => {
      (dataset.backgroundColor as Color[]).splice(index, 1, inactiveColor);
    });
  }

  private setItemActiveStyle(legend: LegendItem): void {
    const datasets = this.api?.data.datasets;
    if (!datasets) {
      return;
    }
    const index = legend.index ?? -1;
    if (index < 0) {
      return;
    }
    const hiddenDataset = this.hiddenDatasets.find((dataset) => dataset.label === legend.text);
    if (hiddenDataset?.backgroundColor) {
      const backgroundColor = hiddenDataset.backgroundColor;
      datasets.map((dataset) => {
        (dataset.backgroundColor as Color[]).splice(index, 1, backgroundColor);
      });
      this.hiddenDatasets = this.hiddenDatasets.filter((dataset) => dataset.label !== legend.text);
    }
  }

  private getTooltip(): Tooltip<typeof this> {
    return new Tooltip(
      this,
      mergeObjects(
        {
          title: (tooltip: CJTooltipModel<CJUnknownChartType>) => {
            return this.options.tooltip?.combineItems ? [''] : tooltip.title;
          },
          items: this.getTooltipItems.bind(this),
        },
        this.options.tooltip || {},
      ),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getTooltipItems(tooltip: CJTooltipModel<CJUnknownChartType>): TooltipItem[] {
    const currentLabel = tooltip.title[0];
    const chart = tooltip.chart;
    const chartData = chart.config.data;
    const tooltipItems: TooltipItem[] = [];
    let sum = 0;
    chartData.datasets.forEach((dataset: any) => {
      dataset.data.forEach((dataItem: number, dataIndex: number) => {
        const label = chartData.labels![dataIndex] as string;
        const color = (dataset.backgroundColor as string[])[dataIndex] as string;
        const value = dataItem;
        sum += value;
        tooltipItems.push({
          label,
          value,
          colors: {
            backgroundColor: color,
            borderColor: color,
          },
          active: currentLabel === label,
        });
      });
    });
    tooltipItems.forEach((tooltipItem) => {
      if (!isNullOrUndefined(tooltipItem.value)) {
        tooltipItem.percent = (tooltipItem.value! * 100) / sum;
      }
    });

    return this.options.tooltip?.combineItems ? tooltipItems : tooltipItems.filter((item) => item.active);
  }
}
