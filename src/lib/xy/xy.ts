import { ChartConfiguration, ChartDataset, ChartOptions, ChartType as ChartJSType } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { merge } from 'lodash-es';
import { defaultChartOptions } from '../../core/chart-options';
import { chartA11y, chartSeriesClick } from '../../core/plugins';
import { tableDataToJSON } from '../../helpers/data';
import { toChartJSType } from '../../helpers/utils';
import { ChartType, LegendItem, MarkerStyle, TableData } from '../../types';
import { Chart } from '../.internal';
import { DataTableLike, DataView, GenericDataModel, SeriesStyleOptions, XYChartOptions } from './xy.types';

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
    },
  };
  static readonly defaultValueAxisOptions = {
    gridDisplay: true,
    display: true,
    stacked: false,
  };

  static readonly defaultScaleOptions = {
    ticks: { padding: 10 },
    grid: {
      drawTicks: false,
    },
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

  // TODO:
  private selectedLegends: LegendItem[] = [];
  protected getConfiguration(): ChartConfiguration {
    let chartDatasets: ChartDataset<ChartJSType, number[]>[] = [];
    this.getChartData();
    if (this.chartData) {
      chartDatasets = this.getDatasets();
    }
    return {
      type: toChartJSType(this.getType()),
      data: {
        labels: this.chartData.category.labels ?? [],
        datasets: chartDatasets,
      },
      options: this.getChartOptions(),
      plugins: [chartA11y],
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
    if (typeof this.options.legend?.display === 'undefined') {
      this.options.legend = this.options.legend || {};
      this.options.legend.display = !(this.options.categoryAxis?.enableColor && this.chartData?.series.length <= 1);
    }
    this.enableLegend();
    const options: ChartOptions = {
      onClick: chartSeriesClick,
      indexAxis: this.isHorizontal(),
      plugins: {
        title: {
          display: !!this.options.title,
          text: this.options.title,
        },
        legend: this.legend?.getChartJSConfiguration({
          overwriteLabels: (labels, chart) => {
            labels.map((label) => {
              if (this.options.legend?.markerStyle) {
                label.pointStyle = this.options.legend?.markerStyle;
                return label;
              }
              let dataset = chart.data.datasets.find((dataset) => dataset.label === label.text);
              dataset = dataset as ChartDataset<'line' | 'bar', number[]>;
              if (dataset.pointStyle) {
                label.pointStyle = dataset.pointStyle as MarkerStyle;
              } else if (dataset?.type === 'line') {
                label.pointStyle = 'line';
                if (dataset.borderDash) {
                  label.lineDash = [2, 2];
                }
              } else {
                label.pointStyle = 'rectRounded';
              }
              return label;
            });
            return labels;
          },
          onItemClick: (chart, legendItem) => {
            if (this.options.legend?.selectable) {
              chart.api?.update();
            } else {
              if (typeof legendItem.datasetIndex !== 'undefined') {
                chart.api?.setDatasetVisibility(
                  legendItem.datasetIndex,
                  !chart.api.isDatasetVisible(legendItem.datasetIndex),
                );
                chart.api?.update();
              }
            }
          },
        }),
        tooltip: {
          position: 'nearest',
        },
      },
      scales: {
        categoryAxis: XYChart.defaultScaleOptions,
        valueAxis: XYChart.defaultScaleOptions,
      },
    };
    if (options?.plugins?.legend?.labels) {
      options.plugins.legend.labels.padding = 25;
    }
    if (this.options.padding) {
      options.layout = merge({}, options.layout, { padding: this.options.padding });
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
        options.scales.categoryAxis = merge({}, XYChart.defaultScaleOptions, options.scales.categoryAxis);
        if (this.options.categoryAxis.position) {
          options.scales.categoryAxis.position = this.options.categoryAxis.position;
        } else {
          options.scales.categoryAxis.position = this.isHorizontal() === 'x' ? 'bottom' : 'left';
        }
        if (this.options.categoryAxis.type) {
          options.scales.categoryAxis.type = this.options.categoryAxis.type;
          if (options.scales.categoryAxis.type === 'time' && this.options.categoryAxis) {
            options.scales.categoryAxis.time = { unit: this.options.categoryAxis.timeUnit };
            options.scales.categoryAxis.ticks = options.scales.categoryAxis.ticks || {};
            options.scales.categoryAxis.ticks.source = 'labels';
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
        valueAxis = merge({}, XYChart.defaultValueAxisOptions, valueAxis);
        if (!valueAxis.position) {
          valueAxis.position = this.isHorizontal() === 'x' ? 'left' : 'bottom';
        }
        const valueAxisKey = 'valueAxis' + (index > 0 ? '_' + index : '');
        options.scales = options.scales || {};
        options.scales[valueAxisKey] = merge(
          {},
          XYChart.defaultScaleOptions,
          {
            stacked: valueAxis.stacked,
            title: {
              display: !!valueAxis.title,
              text: valueAxis.title,
            },
            grid: {
              display: valueAxis.gridDisplay,
            },
            display: valueAxis.display,
          },
          { position: valueAxis.position },
        );
      });
    }
    return options;
  }

  private getDatasets(): ChartDataset<ChartJSType, number[]>[] {
    const chartDataset: ChartDataset<ChartJSType, number[]>[] = [];
    if (!this.chartData.category.labels) {
      throw new Error('Categories cannot be undefined.');
    }
    if (Array.isArray(this.chartData?.series)) {
      let colors: string[] = [];
      if (this.options.categoryAxis?.enableColor) {
        colors = this.getColorsForKeys(this.chartData.category.labels);
      } else {
        colors = this.getColorsForKeys(this.chartData?.series.map((series) => series.name));
      }

      this.chartData?.series?.forEach((series, index) => {
        let dataset: ChartDataset<ChartJSType, number[]> = { data: [] };
        dataset = this.createChartDataset(series, colors, index);
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
    colors: string[],
    index: number,
  ): ChartDataset<ChartJSType, number[]> {
    let dataset: ChartDataset<ChartJSType, number[]> = { data: [] };
    const styleMapping = this.options.seriesOptions?.styleMapping[series.name] ?? {};
    dataset.data = Object.values(series.data ?? []) as number[];
    dataset.label = series.name;
    dataset.borderColor = this.options.categoryAxis?.enableColor ? colors : colors[index];
    dataset.backgroundColor = this.options.categoryAxis?.enableColor ? colors : colors[index];
    dataset.type = toChartJSType(styleMapping?.type || this.getType());
    dataset = this.setAxisIDs(dataset, styleMapping.valueAxisIndex);
    if (styleMapping.order) {
      dataset.order = styleMapping.order;
    }
    if (dataset.type === 'line') {
      dataset = this.createLineDataset(dataset, styleMapping);
    }
    if (dataset.type === 'bar') {
      dataset = this.createBarDataset(dataset);
    }
    return this.afterDatasetCreated(dataset, { styleOptions: styleMapping, color: colors[index], index });
  }

  private createLineDataset(
    dataset: ChartDataset<'line', number[]>,
    styleMapping: SeriesStyleOptions,
  ): ChartDataset<'line', number[]> {
    dataset.borderWidth = 2;
    dataset = dataset as ChartDataset<'line', number[]>;
    dataset.pointStyle = this.setPointStyle(dataset, styleMapping);
    if (styleMapping?.lineStyle === 'dashed') {
      dataset.borderDash = [3, 3];
    }
    if (styleMapping.tension) {
      dataset.tension = styleMapping.tension;
    }
    return dataset;
  }

  private createBarDataset(dataset: ChartDataset<'bar', number[]>): ChartDataset<'bar', number[]> {
    dataset.maxBarThickness = 25;
    return dataset;
  }

  private setPointStyle(
    dataset: ChartDataset<'line', number[]>,
    styleMapping: SeriesStyleOptions,
  ): MarkerStyle | undefined {
    let pointStyle = styleMapping.markerStyle ?? this.options.legend?.markerStyle;
    if (!styleMapping.markerStyle && dataset.data.length > 1) {
      pointStyle = false;
    }
    return pointStyle;
  }

  private setAxisIDs(
    dataset: ChartDataset<ChartJSType, number[]>,
    valueAxisIndex?: number,
  ): ChartDataset<ChartJSType, number[]> {
    dataset = dataset as ChartDataset<'bar', number[]> | ChartDataset<'line', number[]>;
    const valueAxisKey = 'valueAxis' + (valueAxisIndex && valueAxisIndex > 0 ? '_' + valueAxisIndex : '');
    dataset.yAxisID = this.isHorizontal() === 'x' ? valueAxisKey : 'categoryAxis';
    dataset.xAxisID = this.isHorizontal() === 'x' ? 'categoryAxis' : valueAxisKey;
    return dataset;
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
    result.category.labels = data.data.map((item) => item[data.dataKey as string] as string);
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

  protected abstract getType(): ChartType;

  protected afterDatasetCreated(
    dataset: ChartDataset<ChartJSType, number[]>,
    options?: {
      styleOptions?: SeriesStyleOptions;
      color?: string;
      index?: number;
    },
  ): ChartDataset<ChartJSType, number[]> {
    return dataset;
  }
}
