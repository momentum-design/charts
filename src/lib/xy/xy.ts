import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions,
  ChartType as CJType,
  Color,
  Plugin as CJPlugin,
  ScriptableLineSegmentContext,
  Tick,
} from 'chart.js/auto';
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';
import { merge } from 'lodash-es';
import { chartA11y, chartSeriesClick } from '../../core/plugins';
import { tableDataToJSON } from '../../helpers/data';
import { toChartJSType } from '../../helpers/utils';
import {
  ChartDataView,
  ChartType,
  GenericDataModel,
  inactiveColor,
  LegendItem,
  MarkerStyle,
  TableData,
} from '../../types';
import { Chart } from '../.internal';
import { CategoryLabelSelectable } from './xy.category-label-selectable';
import { SeriesStyleOptions, XYChartOptions, XYData } from './xy.types';

export abstract class XYChart extends Chart<XYData, XYChartOptions> {
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }

  static readonly defaults: XYChartOptions = {
    categoryAxis: {
      gridDisplay: true,
      display: true,
      stacked: false,
      ticksPadding: 3,
      maxTicksLimit: 11,
    },
    legend: {
      position: 'bottom',
    },
    scrollDirection: 'y',
  };
  static readonly defaultValueAxisOptions = {
    gridDisplay: true,
    display: true,
    stacked: false,
    ticksPadding: 20,
    maxTicksLimit: 11,
  };

  static readonly defaultScaleOptions = {
    ticks: { padding: 10, maxRotation: 0, autoSkip: true },
    grid: {
      drawTicks: false,
    },
  };

  protected getDefaultOptions(): XYChartOptions {
    return merge({}, XYChart.defaults);
  }

  protected chartData: ChartDataView = {
    category: {
      name: undefined,
      labels: undefined,
    },
    series: [],
  };

  private hiddenDatasets: { label?: string; borderColor?: Color; backgroundColor?: Color }[] = [];
  private borderDash = [3, 3];
  private clickedTickColor = 'black'; //TODO(yiwei): Need to support multiple themes in the future.
  private unclickedTickColor = '#7D7F7F';
  private defaultTickColor = '#484949';
  private categoryLabelSelectable?: CategoryLabelSelectable<typeof this>;

  protected getConfiguration(): ChartConfiguration {
    let chartDatasets: ChartDataset<CJType, number[]>[] = [];
    this.getChartData();
    if (this.chartData) {
      chartDatasets = this.getDatasets();
    }
    const plugins: CJPlugin[] = [chartA11y];
    if (this.options.scrollable) {
      plugins.push(zoomPlugin);
    }
    if (this.isCategoryLabelSelectable()) {
      this.getCategoryLabelSelectable();
      if (this.categoryLabelSelectable) {
        plugins.push(
          this.categoryLabelSelectable.getPlugin({
            labelSelectable: this.options.categoryAxis?.labelSelectable ?? false,
            onLabelClick: (label: string | undefined, selectedItems: string[] | undefined) => {
              if (typeof this.options.categoryAxis?.onLabelClick === 'function') {
                if (this.options.categoryAxis?.labelSelectable) {
                  this.options.categoryAxis.onLabelClick(label, selectedItems);
                } else {
                  this.options.categoryAxis.onLabelClick(label);
                }
              }
            },
          }),
        );
      }
    }
    return {
      type: toChartJSType(this.getType()),
      data: {
        labels: this.chartData.category.labels ?? [],
        datasets: chartDatasets,
      },
      options: this.getChartOptions(),
      plugins: plugins,
    };
  }

  protected getChartData(): void {
    let data: XYData = [];
    if (!this.data) {
      return;
    }
    try {
      if (this.data instanceof String) {
        data = JSON.parse(this.data as unknown as string) as XYData;
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
    this.options.legend = this.options.legend || {};
    if (!this.options.legend.display) {
      this.options.legend.display = !(this.options.categoryAxis?.enableColor && this.chartData?.series.length <= 1);
    }
    this.options.legend.states = {
      setItemInactiveStyle: (legendItem): void => {
        return this.setItemInactiveStyle(legendItem);
      },
      setItemActiveStyle: (legendItem): void => {
        return this.setItemActiveStyle(legendItem);
      },
    };

    this.enableLegend();
    const options: ChartOptions = {
      onClick: chartSeriesClick,
      maintainAspectRatio: false,
      responsive: true,
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
                label.lineWidth = 0;
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
      options.plugins.legend.labels.padding = 16;
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
          max:
            typeof this.options.categoryAxis.maxLabels === 'number'
              ? this.options.categoryAxis.maxLabels - 1
              : undefined,
          ticks: {
            autoSkip: this.options.categoryAxis.autoSkip,
            autoSkipPadding: this.options.categoryAxis.ticksPadding,
            maxTicksLimit: this.options.categoryAxis.maxTicksLimit,
            color: this.options.categoryAxis.labelColor,
          },
          display: this.options.categoryAxis.display,
        };
        options.scales.categoryAxis = merge({}, XYChart.defaultScaleOptions, options.scales.categoryAxis);
        if (this.options.categoryAxis.position) {
          options.scales.categoryAxis.position = this.options.categoryAxis.position;
        } else {
          options.scales.categoryAxis.position = this.isHorizontal() === 'x' ? 'bottom' : 'left';
        }
        options.scales.categoryAxis.ticks = options.scales.categoryAxis.ticks || {};
        if (this.options.categoryAxis.type) {
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

        if (!this.options.categoryAxis.type || this.options.categoryAxis.type === 'category') {
          if (this.options.categoryAxis.callback) {
            const categoryCallback = this.options.categoryAxis.callback;
            options.scales.categoryAxis.ticks = {
              ...options.scales.categoryAxis.ticks,
              callback: function (val: number | string, index: number, ticks: Tick[]) {
                return typeof categoryCallback === 'function'
                  ? categoryCallback(this.getLabelForValue(val as number), index, ticks)
                  : this.getLabelForValue(val as number);
              },
            };
          }
          if (this.options.categoryAxis?.labelSelectable && this.categoryLabelSelectable?.selectedLabels) {
            options.scales.categoryAxis.ticks = {
              ...options.scales.categoryAxis.ticks,
              color: (ctx) => {
                if (this.options.categoryAxis?.labelColor) {
                  return this.options.categoryAxis.labelColor as Color;
                }
                const selectedLabels = this.categoryLabelSelectable?.selectedLabels ?? [];
                let firstTickIndex = 0;
                let lastTickIndex = 0;
                ctx.chart.scales.categoryAxis.ticks?.map((tick, index) => {
                  index === 0 ? (firstTickIndex = tick.value) : (lastTickIndex = tick.value);
                });
                if (selectedLabels.length > 0) {
                  const allColors = ctx.chart.data.labels?.map((label) => {
                    return selectedLabels.indexOf(label as string) >= 0
                      ? this.clickedTickColor
                      : this.unclickedTickColor;
                  });
                  return (allColors?.slice(firstTickIndex, lastTickIndex + 1) ?? []) as unknown as Color;
                } else {
                  return this.defaultTickColor;
                }
              },
            };
          }
        }
      }
    }

    if (!this.options.valueAxes) {
      this.options.valueAxes = [{}];
    }
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
        {
          max: valueAxis.max,
          min: valueAxis.min,
          suggestedMax: valueAxis.suggestedMax,
          suggestedMin: valueAxis.suggestedMin,
          ticks: {
            autoSkip: valueAxis.autoSkip,
            autoSkipPadding: valueAxis.ticksPadding,
            maxTicksLimit: valueAxis.maxTicksLimit,
            color: valueAxis.labelColor,
            callback: (tickValue: number | string, index: number) => {
              return typeof valueAxis.callback === 'function'
                ? valueAxis.callback(tickValue, index)
                : typeof tickValue === 'number'
                ? this.formatBigNumber(tickValue)
                : tickValue;
            },
            stepSize: valueAxis.ticksStepSize,
            precision: this.options.valuePrecision,
          },
        },
        { position: valueAxis.position },
      );
    });

    return options;
  }

  private getDatasets(): ChartDataset<CJType, number[]>[] {
    const chartDataset: ChartDataset<CJType, number[]>[] = [];
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
        let dataset: ChartDataset<CJType, number[]> = { data: [] };
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
      data?: (number | null)[];
    },
    colors: string[],
    index: number,
  ): ChartDataset<CJType, number[]> {
    let dataset: ChartDataset<CJType, number[]> = { data: [] };
    const styleMapping = this.options.seriesOptions?.styleMapping?.[series.name] ?? {};
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
    if (styleMapping.fillGaps) {
      dataset.spanGaps = styleMapping.fillGaps;
      dataset.segment = {
        borderColor: (ctx: ScriptableLineSegmentContext) =>
          ctx.p0.skip || ctx.p1.skip ? (dataset.borderColor as Color) : undefined,
        borderDash: (ctx: ScriptableLineSegmentContext) => (ctx.p0.skip || ctx.p1.skip ? this.borderDash : undefined),
      };
    }
    dataset.pointStyle = this.setPointStyle(dataset, styleMapping);
    if (styleMapping.type === 'dashed' || styleMapping.type === 'dashedArea') {
      dataset.borderDash = this.borderDash;
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
    dataset.pointRadius = dataset.data.length > 1 ? 0 : 2;
    dataset.pointHoverRadius = 5;
    return styleMapping.markerStyle ?? this.options.legend?.markerStyle;
  }

  private setAxisIDs(dataset: ChartDataset<CJType, number[]>, valueAxisIndex?: number): ChartDataset<CJType, number[]> {
    dataset = dataset as ChartDataset<'bar', number[]> | ChartDataset<'line', number[]>;
    const valueAxisKey = 'valueAxis' + (valueAxisIndex && valueAxisIndex > 0 ? '_' + valueAxisIndex : '');
    dataset.yAxisID = this.isHorizontal() === 'x' ? valueAxisKey : 'categoryAxis';
    dataset.xAxisID = this.isHorizontal() === 'x' ? 'categoryAxis' : valueAxisKey;
    return dataset;
  }

  private transformGenericData(sourceData: XYData): GenericDataModel {
    const result: GenericDataModel = {
      dataKey: this.options.categoryAxis?.dataKey,
      data: [],
    };
    if (typeof sourceData[0] === 'object' && !Array.isArray(sourceData[0])) {
      const data = sourceData as Record<string, string | number | null>[];
      result.dataKey = result.dataKey ?? Object.keys(data[0])[0];
      result.data = data;
    } else if (Array.isArray(sourceData[0])) {
      const data = sourceData as unknown[][];
      result.dataKey = result.dataKey ?? (data[0][0] as string);
      result.data = tableDataToJSON(data);
    }
    return result;
  }

  private genericToDataView(data: GenericDataModel): ChartDataView {
    const result: ChartDataView = {
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
    const seriesNames = this.getCombinedKeys(data.data).filter((key) => key !== data.dataKey);
    const seriesData = seriesNames.map((name) => {
      return {
        name: name,
        data: data.data.map((item) => (item[name] as number) ?? null),
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
    dataset: ChartDataset<CJType, number[]>,
    _options?: {
      styleOptions?: SeriesStyleOptions;
      color?: string;
      index?: number;
    },
  ): ChartDataset<CJType, number[]> {
    return dataset;
  }

  private setItemInactiveStyle(legend: LegendItem): void {
    let dataset = this.api?.data.datasets.find((dataset) => dataset.label === legend.text);
    if (!dataset) {
      return;
    }
    dataset = dataset as ChartDataset<CJType, number[]>;
    this.hiddenDatasets.push({
      label: dataset.label,
      borderColor: dataset.borderColor as Color,
      backgroundColor: dataset.backgroundColor as Color,
    });
    dataset.borderColor = inactiveColor;
    dataset.backgroundColor = inactiveColor;
  }

  private setItemActiveStyle(legend: LegendItem): void {
    let dataset = this.api?.data.datasets.find((dataset) => dataset.label === legend.text);
    if (!dataset) {
      return;
    }
    dataset = dataset as ChartDataset<CJType, number[]>;
    const hiddenDataset = this.hiddenDatasets.find((dataset) => dataset.label === legend.text);
    if (hiddenDataset) {
      dataset.borderColor = hiddenDataset?.borderColor;
      dataset.backgroundColor = hiddenDataset?.backgroundColor;
      this.hiddenDatasets = this.hiddenDatasets.filter((dataset) => dataset.label !== legend.text);
    }
  }

  private getCombinedKeys(data: Record<string, string | number | null>[]): string[] {
    const mergedKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        mergedKeys.add(key);
      });
    });
    return Array.from(mergedKeys);
  }

  private isCategoryLabelSelectable(): boolean {
    return (
      (typeof this.options.categoryAxis?.onLabelClick === 'function' || this.options.categoryAxis?.labelSelectable) ??
      false
    );
  }

  onWheel(event: WheelEvent): void {
    if (this.options?.scrollable && event && event.deltaY !== 0) {
      this.api?.pan({
        y: -event.deltaY,
      });
      event.preventDefault();
    }
  }

  getCategoryLabelSelectable(): CategoryLabelSelectable<typeof this> {
    this.categoryLabelSelectable = this.categoryLabelSelectable ?? new CategoryLabelSelectable(this);
    return this.categoryLabelSelectable;
  }
}
