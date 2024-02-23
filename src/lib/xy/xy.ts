import {
  ChartConfiguration,
  ChartDataset,
  ChartOptions as CJOptions,
  ChartType as CJType,
  Color,
  Plugin as CJPlugin,
  ScriptableLineSegmentContext,
  Tick,
  TooltipModel as CJTooltipModel,
} from 'chart.js/auto';
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';
import { merge } from 'lodash-es';
import { chartA11y, chartSeriesClick } from '../../core/plugins';
import { tableDataToJSON } from '../../helpers/data';
import { isNullOrUndefined, mergeObjects, toChartJSType } from '../../helpers/utils';
import {
  ChartDataView,
  ChartType,
  CJUnknownChartType,
  GenericDataModel,
  inactiveColor,
  LegendItem,
  MarkerStyle,
  Position,
  TableData,
} from '../../types';
import { Chart } from '../.internal';
import { Tooltip, TooltipItem } from '../tooltip';
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
    },
    legend: {
      position: Position.Bottom,
    },
    scrollDirection: 'y',
  };
  static readonly defaultValueAxisOptions = {
    gridDisplay: true,
    display: true,
    stacked: false,
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
  private visibleLabelColor = this.getThemeSchema()?.activeColor;
  private invisibleLabelColor = this.getThemeSchema()?.inactiveColor;
  private defaultLabelColor = this.getThemeSchema()?.textColorPrimary;
  private defaultMinTicksLimit = 2;
  private defaultPaddingForX = 100;
  private defaultPaddingCategoryAxisForY = 20;
  private defaultPaddingValueAxisForY = 50;

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

  private getChartOptions(): CJOptions {
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
    const tooltip = this.getTooltip();
    const options: CJOptions = {
      onClick: chartSeriesClick,
      maintainAspectRatio: false,
      responsive: true,
      indexAxis: this.getIndexAxis(),

      interaction: tooltip.toCJInteraction(),

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
        tooltip: tooltip.toCJ(),
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
            maxTicksLimit: this.options.categoryAxis.maxTicksLimit,
            color: this.options.categoryAxis.labelColor,
          },
          display: this.options.categoryAxis.display,
        };
        options.scales.categoryAxis = merge({}, XYChart.defaultScaleOptions, options.scales.categoryAxis);
        if (this.options.categoryAxis.position) {
          options.scales.categoryAxis.position = this.options.categoryAxis.position;
        } else {
          options.scales.categoryAxis.position = this.isHorizontal() ? Position.Left : Position.Bottom;
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
              options.scales.categoryAxis.time.tooltipFormat = this.options.categoryAxis.labelFormat;
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
                      ? this.visibleLabelColor
                      : this.invisibleLabelColor;
                  });
                  return (allColors?.slice(firstTickIndex, lastTickIndex + 1) ?? []) as unknown as Color;
                } else {
                  return this.defaultLabelColor;
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
        valueAxis.position = this.isHorizontal() ? Position.Bottom : Position.Left;
      }
      const valueAxisKey = this.getValueAxisAlias(index);
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
    dataset.yAxisID = this.isHorizontal() ? 'categoryAxis' : valueAxisKey;
    dataset.xAxisID = this.isHorizontal() ? valueAxisKey : 'categoryAxis';
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

  private getIndexAxis(): 'x' | 'y' {
    return this.isHorizontal() ? 'y' : 'x';
  }

  private isHorizontal(): boolean {
    const firstValueAxis = this.options.valueAxes?.[0];
    if (!this.options.categoryAxis?.position && !firstValueAxis?.position) {
      if (!this.options.categoryAxis) {
        this.options.categoryAxis = {};
      }
      this.options.categoryAxis.position = this.getType() === ChartType.Bar ? Position.Left : Position.Bottom;
    }
    const isHorizontal =
      this.options.categoryAxis?.position === Position.Left ||
      this.options.categoryAxis?.position === Position.Right ||
      firstValueAxis?.position === Position.Top ||
      firstValueAxis?.position === Position.Bottom;
    return isHorizontal;
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

  calculateMaxLimitTicks(options: CJOptions): void {
    const scales = options.scales;
    if (scales) {
      const categoryScale = scales.categoryAxis;
      if (categoryScale?.ticks && categoryScale.ticks.maxTicksLimit === undefined && this.options.categoryAxis) {
        categoryScale.ticks.maxTicksLimit = this.getMaxLimitTicks(
          'categoryAxis',
          this.options.categoryAxis.ticksPadding,
        );
      }
      this.options.valueAxes?.forEach((valueAxis, index) => {
        const valueAxisKey = this.getValueAxisAlias(index);
        const valueScale = scales[valueAxisKey];
        if (valueScale?.ticks && valueScale.ticks.maxTicksLimit === undefined) {
          valueScale.ticks.maxTicksLimit = this.getMaxLimitTicks('valueAxis', valueAxis.ticksPadding);
        }
      });
    }
  }

  private getMaxLimitTicks(type: 'categoryAxis' | 'valueAxis', ticksPadding?: number): number {
    ticksPadding = ticksPadding ?? this.getDefaultTicksPadding(type);
    let limitTicks = 0;
    let paddingTop = 0;
    let paddingBottom = 0;
    let paddingLeft = 0;
    let paddingRight = 0;
    if (this.options.padding) {
      if (typeof this.options.padding === 'number') {
        paddingTop = paddingBottom = paddingLeft = paddingRight = this.options.padding;
      } else {
        paddingTop = this.options.padding.top ?? 0;
        paddingBottom = this.options.padding.bottom ?? 0;
        paddingLeft = this.options.padding.left ?? 0;
        paddingRight = this.options.padding.right ?? 0;
      }
    }
    let xLimitTicks = 0;
    if (this.rootElement?.offsetWidth) {
      xLimitTicks = Math.ceil((this.rootElement.offsetWidth - (paddingLeft + paddingRight)) / ticksPadding);
    }
    let yLimitTicks = 0;
    if (this.rootElement?.offsetHeight) {
      yLimitTicks = Math.ceil((this.rootElement.offsetHeight - (paddingTop + paddingBottom)) / ticksPadding);
    }
    if (type === 'categoryAxis') {
      limitTicks = this.isHorizontal() ? yLimitTicks : xLimitTicks;
    } else {
      limitTicks = this.isHorizontal() ? xLimitTicks : yLimitTicks;
    }
    return Math.max(limitTicks, this.defaultMinTicksLimit);
  }

  private getDefaultTicksPadding(type: string): number {
    if (type === 'categoryAxis') {
      return this.isHorizontal() ? this.defaultPaddingCategoryAxisForY : this.defaultPaddingForX;
    } else {
      return this.isHorizontal() ? this.defaultPaddingForX : this.defaultPaddingValueAxisForY;
    }
  }

  private getValueAxisAlias(index: number): string {
    return 'valueAxis' + (index > 0 ? '_' + index : '');
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

  private getTooltip(): Tooltip<typeof this> {
    return new Tooltip(
      this,
      mergeObjects(
        {
          useNative: false,
          showPercentage: true,
          combineItems: false,
          title: (tooltip: CJTooltipModel<CJUnknownChartType>) => tooltip.title || [],
          items: this.getTooltipItems.bind(this),
        },
        this.options.tooltip || {},
      ),
    );
  }

  private getTooltipItems(tooltip: CJTooltipModel<CJUnknownChartType>): TooltipItem[] {
    let sum = 0;
    const tooltipItems: TooltipItem[] = tooltip.body
      .map((body: { lines: string[] }) => body.lines)
      .map((lines: string[], i: number) => {
        const colors = tooltip.labelColors[i];
        const label = lines[0].split(':')[0];
        let value;
        if (lines[0].split(':').length > 1) {
          value = parseFloat(lines[0].split(':')[1].replace(/,/g, ''));
        }
        const result: TooltipItem = {
          colors: {
            backgroundColor: colors.backgroundColor as string,
            borderColor: colors.borderColor as string,
          },
          label,
          value,
        };
        sum += result.value || 0;
        return result;
      });

    if (this.options.tooltip?.showPercentage && sum !== 0) {
      tooltipItems.forEach((tooltipItem) => {
        if (!isNullOrUndefined(tooltipItem.value)) {
          tooltipItem.percent = (tooltipItem.value! * 100) / sum;
        }
      });
    }

    return tooltipItems;
  }
}
