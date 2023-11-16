import { ChartConfiguration, ChartDataset, ChartOptions, ChartType as ChartJSType } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { merge } from 'lodash-es';
import { ThemeKey, themes } from '../../core';
import { defaultChartOptions } from '../../core/chart-options';
import {
  chartA11y,
  chartLegendA11y,
  chartSeriesClick,
  legendClickHandler,
  legendHandleHover,
  legendHandleLeave,
} from '../../core/plugins';
import { externalTooltipHandler } from '../../core/plugins/chart-tooltip';
import { LegendClickData } from '../../core/plugins/plugin.types';
import { getCurrentTheme, tableDataToJSON } from '../../core/utils';
import { ChartType, TableData } from '../../types';
import { Chart } from '../.internal';
import { DataTableLike, DataView, GenericDataModel, XYChartOptions } from './xy.types';

export abstract class XYChart extends Chart<DataTableLike, XYChartOptions> {
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }

  static readonly defaultOptions: XYChartOptions = {
    categoryAxis: {
      gridDisplay: true,
      display: true,
      stacked: false,
    },
    legend: {
      position: 'bottom',
      display: true,
      isLegendClick: false,
    },
  };
  static readonly defaultValueAxisOptions = {
    gridDisplay: true,
    display: true,
    stacked: false,
  };

  protected getDefaultOptions(): XYChartOptions {
    return merge(XYChart.defaultOptions, defaultChartOptions);
  }

  protected chartData: DataView = {
    category: {
      name: undefined,
      labels: undefined,
    },
    series: [],
  };

  protected getConfiguration(): ChartConfiguration {
    let chartLabels: unknown[] = [];
    let chartDatasets: ChartDataset<ChartJSType, number[]>[] = [];
    this.getChartData();
    if (this.chartData) {
      chartLabels = this.chartData.category.labels ?? [];
      chartDatasets = this.getDatasets();
    }
    return {
      type: this.toChartJsType(this.getType()) as ChartJSType,
      data: {
        labels: chartLabels,
        datasets: chartDatasets,
      },
      options: this.getChartOptions(),
      plugins: [chartA11y, chartLegendA11y],
    };
  }

  protected getChartData(): void {
    let data: DataTableLike = [];
    if (!this.data) {
      return;
    }
    try {
      if (this.data instanceof String) {
        data = JSON.parse(this.data as unknown as string) as DataTableLike;
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

  private getChartOptions(): ChartOptions {
    const options: ChartOptions = {
      onClick: chartSeriesClick,
      indexAxis: this.isHorizontal(),
      plugins: {
        title: {
          display: !!this.options.title,
          text: this.options.title,
        },
        legend: {
          display: this.options.legend?.display,
          position: this.options.legend?.position,
          labels: {
            boxWidth: this.options.legend?.legendLabelsWidth,
            boxHeight: this.options.legend?.legendLabelsHeight,
            useBorderRadius: !!this.options.legend?.legendBorderRadius,
            borderRadius: this.options.legend?.legendBorderRadius,
          },
          onClick: legendClickHandler,
          onHover: legendHandleHover,
          onLeave: legendHandleLeave,
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: externalTooltipHandler,
        },
      },
      scales: {
        categoryAxis: {},
        valueAxis: {},
      },
    };
    if (this.options.padding) {
      options.layout = {
        padding: this.options.padding,
      };
    }
    if (this.options.categoryAxis) {
      if (options.scales?.categoryAxis) {
        options.scales.categoryAxis = {
          stacked: this.options.categoryAxis.stacked,
          title: {
            display: !!this.options.categoryAxis.title,
            text: this.options.categoryAxis.title,
          },
          grid: {
            display: this.options.categoryAxis.gridDisplay,
          },
          display: this.options.categoryAxis.display,
        };
        if (this.options.categoryAxis.position) {
          options.scales.categoryAxis.position = this.options.categoryAxis.position;
        } else {
          options.scales.categoryAxis.position = this.isHorizontal() === 'x' ? 'bottom' : 'left';
        }
        if (this.options.categoryAxis?.type) {
          options.scales.categoryAxis.type = this.options.categoryAxis.type;
          if (options.scales.categoryAxis.type === 'time' && this.options.categoryAxis) {
            options.scales.categoryAxis.time = { unit: this.options.categoryAxis.timeUnit };
            if (this.options.categoryAxis.labelFormat) {
              options.scales.categoryAxis.time.displayFormats = {
                [this.options.categoryAxis.timeUnit as string]: this.options.categoryAxis.labelFormat,
              };
            }
          }
        }
      }
    }
    if (this.options.valueAxes) {
      this.options.valueAxes.forEach((valueAxis, index) => {
        valueAxis = {
          ...XYChart.defaultValueAxisOptions,
          ...valueAxis,
        };
        if (!valueAxis.position) {
          valueAxis.position = this.isHorizontal() === 'x' ? 'left' : 'bottom';
        }
        const valueAxisKey = 'valueAxis' + (index > 0 ? '_' + index : '');
        options.scales = {
          ...options.scales,
        };

        options.scales[valueAxisKey] = {
          ...options.scales[valueAxisKey],
        };
        options.scales[valueAxisKey] = {
          stacked: valueAxis.stacked,
          title: {
            display: !!valueAxis.title,
            text: valueAxis.title,
          },
          grid: {
            display: valueAxis.gridDisplay,
          },
          display: valueAxis.display,
        };

        options.scales[valueAxisKey] = {
          ...options.scales[valueAxisKey],
          ...{ position: valueAxis.position },
        };
      });
    }
    return options;
  }

  private getDatasets(): ChartDataset<ChartJSType, number[]>[] {
    const chartDataset: ChartDataset<ChartJSType, number[]>[] = [];
    if (Array.isArray(this.chartData?.series)) {
      this.chartData?.series?.forEach((series, index) => {
        let dataset: ChartDataset<ChartJSType, number[]> = { data: [] };
        dataset = this.createChartDataset(series, index);
        if (dataset) {
          chartDataset.push(dataset);
        }
      });
    }
    return chartDataset;
  }

  protected createChartDataset(
    series: {
      name: string;
      data?: number[];
    },
    index: number,
  ): ChartDataset<ChartJSType, number[]> {
    let dataset: ChartDataset<ChartJSType, number[]> = { data: [] };
    const colors = this.options ? this.getBackgroundColor(this.options) ?? [] : [];
    const styleMapping = this.options.seriesOptions?.styleMapping[series.name] ?? {};
    const colorIndex = index % colors.length;
    dataset.data = Object.values(series.data ?? []) as number[];
    dataset.label = series.name;
    dataset.borderColor = this.options.categoryAxis?.enableColor ? colors : colors[colorIndex];
    dataset.backgroundColor = this.options.categoryAxis?.enableColor ? colors : colors[colorIndex];
    dataset.type = this.toChartJsType(styleMapping?.type);
    dataset = this.setAxisIDs(dataset, styleMapping.valueAxisIndex);
    if (dataset.type === 'line') {
      dataset = dataset as ChartDataset<ChartType.Line, number[]>;
      if (styleMapping?.lineStyle === 'dashed') {
        dataset.borderDash = [3, 3];
      }
    }
    return this.afterDatasetCreated(dataset, { styleMapping: styleMapping }, index);
  }
  private setAxisIDs(
    dataset: ChartDataset<ChartJSType, number[]>,
    valueAxisIndex?: number,
  ): ChartDataset<ChartJSType, number[]> {
    dataset = dataset as ChartDataset<ChartType.Bar, number[]> | ChartDataset<ChartType.Line, number[]>;
    const valueAxisKey = 'valueAxis' + (valueAxisIndex && valueAxisIndex > 0 ? '_' + valueAxisIndex : '');
    dataset.yAxisID = this.isHorizontal() === 'x' ? valueAxisKey : 'categoryAxis';
    dataset.xAxisID = this.isHorizontal() === 'x' ? 'categoryAxis' : valueAxisKey;
    return dataset;
  }

  protected getBackgroundColor(chartOptions: XYChartOptions): string[] | undefined {
    return typeof chartOptions?.theme === 'string'
      ? themes.get(chartOptions?.theme as keyof typeof ThemeKey)
      : getCurrentTheme().colors;
  }

  private transformGenericData(sourceData: DataTableLike): GenericDataModel {
    const result: GenericDataModel = {
      dataKey: this.options.categoryAxis?.dataKey,
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
        name: data.dataKey ?? '',
        labels: [],
      },
      series: [],
    };

    if (!data?.dataKey) {
      return result;
    }
    result.category.labels = data.data.map((item) => item[data.dataKey as string]);
    const seriesNames = Object.keys(data.data[0]).filter((key) => key !== data.dataKey);

    const seriesData = seriesNames.map((name) => {
      return {
        name: name,
        data: data.data.map((item) => item[name] as number),
      };
    });

    result.series = seriesData;
    return result;
  }

  private toChartJsType(type?: string): ChartJSType {
    let chartType: ChartJSType;
    switch (type || this.getType()) {
      case ChartType.Bar:
      case ChartType.Column:
        chartType = 'bar';
        break;
      case ChartType.Line:
      case ChartType.Area:
      case ChartType.Range:
        chartType = 'line';
        break;
      default:
        chartType = 'line';
        break;
    }
    return chartType;
  }

  private isHorizontal(): 'x' | 'y' {
    const firstValueAxis = this.options.valueAxes?.[0];
    if (!this.options.categoryAxis?.position && !firstValueAxis?.position) {
      if (!this.options.categoryAxis) {
        this.options.categoryAxis = {};
      }
      this.options.categoryAxis.position = this.getType() === ChartType.Bar ? 'left' : 'bottom';
    }
    const isHorizontal =
      this.options.categoryAxis?.position === 'left' ||
      this.options.categoryAxis?.position === 'right' ||
      firstValueAxis?.position === 'top' ||
      firstValueAxis?.position === 'bottom';
    return isHorizontal ? 'y' : 'x';
  }

  private onLegendClick(selectedItem: LegendClickData[]): void {
    const options = {
      detail: { selectedItem: selectedItem },
      bubbles: true,
      composed: true,
    };
  }

  protected abstract getType(): ChartType;
  protected abstract afterDatasetCreated(
    dataset: ChartDataset<ChartJSType, number[]>,
    seriesOptions?: {
      styleMapping?: {
        type?: string;
        lineStyle?: string;
      };
    },
    index?: number,
  ): ChartDataset<ChartJSType, number[]>;
}
