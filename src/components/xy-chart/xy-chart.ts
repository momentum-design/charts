import { ChartConfiguration, ChartConfigurationCustomTypesPerDataset, ChartDataset, ChartOptions, ChartType } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { customElement, property } from 'lit/decorators.js';
import { merge } from 'lodash-es';
import { ChartElement, COMPONENT_PREFIX, ThemeKey, themes } from '../../core';
import { defaultChartOptions } from '../../core/chart-options';
import { chartA11y, chartLegendA11y, chartSeriesClick, legendClickHandler, legendHandleHover, legendHandleLeave } from '../../core/plugins';
import { externalTooltipHandler } from '../../core/plugins/chart-tooltip';
import { LegendClickData } from '../../core/plugins/plugin.types';
import { getCurrentTheme, tableDataToJSON, transparentizeColor } from '../../core/utils';
import { ChartTypeEnum } from '../../types';
import { defaultXYChartOptions } from './xy-chart.options';
import { DataTableLike, DataView, GenericDataModel, XYChartOptions } from './xy-chart.types';

interface CurrentChartOptions extends XYChartOptions, ChartOptions<ChartType> {
  isLegendClick?: boolean;
  isMultipleSeries?: boolean;
  seriesTooltipHead?: string;
  seriesTooltipBody?: string;
  seriesTooltipFooter?: string;
  seriesTooltipFloor?: number;
  isMultipleLegend?: boolean;
  legendTooltipHead?: string;
  legendTooltipBody?: string;
  legendTooltipFooter?: string;
  legendTooltipFloor?: number;
  selectedLegends?: string[];
  onLegendClick?: (legendItem: { label: string | number; value: string | number }[]) => void;
}

/**
 * Basically this is a chart type, that is used to display any chart.
 *
 * The horizontal and vertical scale is determined by the type of Axis.
 *
 *
 * @example
 * You can implement a specific chart by following code.
 * ```ts
  <mdw-xy
    type="bar"
    style="width: 40%"
    data='[["Year", "Things", "Stuff"],
    ["2004", 1000, 400],
    ["2005", 1170, 460],
    ["2006", 660, 1120],
    ["2007", 1030, 540]]'
    options='{
      "categoryAxis": {
        "stacked":true,
        "enableColor":false
      },
      "valueAxis":{
        "stacked":true,
        "title":"value"
      },
      "title":"My First Bar Chart",
      "theme": "qualitative-colors-primary",
      "legend":{
        "isLegendClick": true
      }
    }'
  ></mdw-xy>
 * ```
 *
 * @typeParam data - the data of chart
 * @typeParam options - the options of chart
 */
@customElement(`${COMPONENT_PREFIX}-xy`)
export class XYChart extends ChartElement<DataTableLike, XYChartOptions> {
  /**
   * Set the chart type, currently supports 'area', 'bar', 'column', 'line', and 'range'
   */
  @property({ type: String, hasChanged: () => true })
  type: ChartTypeEnum = ChartTypeEnum.Line;

  /**
   * Internal data displayed on the chart.
   */
  @property({ type: Object }) _data: DataView | undefined = undefined;

  private chartOptions!: XYChartOptions;
  private currentChartOptions: CurrentChartOptions | undefined;

  protected getChartJSConfiguration(): ChartConfiguration | ChartConfigurationCustomTypesPerDataset {
    let chartLabels: unknown[] = [];
    let chartDatasets: ChartDataset<ChartType, number[]>[] = [];
    this.initData();
    if (this._data) {
      chartLabels = this._data.category.labels ?? [];
      this.chartOptions = merge({}, defaultChartOptions, defaultXYChartOptions, this.options);
      chartDatasets = this.handleChartDataset();
      this.currentChartOptions = this.handleChartOptions();
    }
    return {
      type: this.getChartType(),
      data: {
        labels: chartLabels,
        datasets: chartDatasets,
      },
      options: this.currentChartOptions,
      plugins: [chartA11y, chartLegendA11y],
    };
  }

  private onLegendClick(selectedItem: LegendClickData[]): void {
    const options = {
      detail: { selectedItem: selectedItem },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('legendClick', options));
  }

  private handleChartOptions(): CurrentChartOptions {
    const options: CurrentChartOptions = {
      responsive: this.chartOptions.responsive,
      aspectRatio: this.chartOptions.aspectRatio,
      isLegendClick: this.chartOptions.legend?.isLegendClick,
      isMultipleSeries: this.chartOptions.tooltip?.isMultipleSeries,
      seriesTooltipFloor: this.chartOptions.tooltip?.seriesTooltipFloor,
      seriesTooltipFooter: this.chartOptions.tooltip?.seriesTooltipFooter,
      seriesTooltipHead: this.chartOptions.tooltip?.seriesTooltipHead,
      seriesTooltipBody: this.chartOptions.tooltip?.seriesTooltipBody,
      isMultipleLegend: this.chartOptions.tooltip?.isMultipleLegend,
      legendTooltipHead: this.chartOptions.tooltip?.legendTooltipHead,
      legendTooltipBody: this.chartOptions.tooltip?.legendTooltipBody,
      legendTooltipFooter: this.chartOptions.tooltip?.legendTooltipFooter,
      legendTooltipFloor: this.chartOptions.tooltip?.legendTooltipFloor,
      selectedLegends: [],
      onLegendClick: (selectedItem: LegendClickData[]): void => {
        this.onLegendClick(selectedItem);
      },
      onClick: chartSeriesClick,
      indexAxis: this.isHorizontal(),
      plugins: {
        title: {
          display: !!this.chartOptions.title,
          text: this.chartOptions.title,
        },
        legend: {
          display: this.chartOptions.legend?.legendDisplay,
          position: this.chartOptions.legend?.legendPosition,
          labels: {
            boxWidth: this.chartOptions.legend?.legendLabelsWidth,
            boxHeight: this.chartOptions.legend?.legendLabelsHeight,
            useBorderRadius: !!this.chartOptions.legend?.legendBorderRadius,
            borderRadius: this.chartOptions.legend?.legendBorderRadius,
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

    if (this.chartOptions.categoryAxis && this.chartOptions.valueAxis) {
      if (!this.chartOptions.categoryAxis.position) {
        this.chartOptions.categoryAxis.position = this.isHorizontal() === 'x' ? 'bottom' : 'left';
      }
      if (!this.chartOptions.valueAxis.position) {
        this.chartOptions.valueAxis.position = this.isHorizontal() === 'x' ? 'left' : 'bottom';
      }
    }

    if (this.chartOptions.valueAxis && options.scales?.valueAxis && (options.scales.valueAxis.type === 'category' || options.scales.valueAxis.type === 'time')) {
      options.scales.valueAxis.position = this.chartOptions.valueAxis.position;
    }

    if (this.chartOptions.categoryAxis && options.scales?.categoryAxis) {
      options.scales.categoryAxis = {
        stacked: this.chartOptions.categoryAxis.stacked,
        title: {
          display: !!this.chartOptions.categoryAxis.title,
          text: this.chartOptions.categoryAxis.title,
        },
        grid: {
          display: this.chartOptions.categoryAxis.gridDisplay,
        },
        display: this.chartOptions.categoryAxis.display,
      };
      if (this.chartOptions.categoryAxis.position) {
        options.scales.categoryAxis.position = this.chartOptions.categoryAxis.position;
      }
      if (this.chartOptions.categoryAxis?.type) {
        options.scales.categoryAxis.type = this.chartOptions.categoryAxis.type;
        if (options.scales.categoryAxis.type === 'time' && this.chartOptions.categoryAxis) {
          options.scales.categoryAxis.time = { unit: this.chartOptions.categoryAxis.timeUnit };
          if (this.chartOptions.categoryAxis.labelFormat) {
            options.scales.categoryAxis.time.displayFormats = {
              [this.chartOptions.categoryAxis.timeUnit as string]: this.chartOptions.categoryAxis.labelFormat,
            };
          }
        }
      }
    }

    if (this.chartOptions.valueAxis && options.scales?.valueAxis) {
      options.scales.valueAxis = {
        stacked: this.chartOptions.valueAxis.stacked,
        title: {
          display: !!this.chartOptions.valueAxis.title,
          text: this.chartOptions.valueAxis.title,
        },
        grid: {
          display: this.chartOptions.valueAxis.gridDisplay,
        },
        display: this.chartOptions.valueAxis.display,
      };

      if (this.chartOptions.valueAxis.position) {
        options.scales.valueAxis.position = this.chartOptions.valueAxis.position;
      }
    }

    return options;
  }

  private handleChartDataset(): ChartDataset<ChartType, number[]>[] {
    const chartDataset: ChartDataset<ChartType, number[]>[] = [];
    if (!this._data) {
      return chartDataset;
    }
    if (Array.isArray(this._data.series)) {
      const colors = this.getBackgroundColor(this.chartOptions) ?? [];
      this._data.series?.forEach((series, index) => {
        const seriesOptions = this.chartOptions.seriesOptions?.styleMapping[series.name];
        const colorIndex = index % colors.length;
        let dataset: ChartDataset<ChartType, number[]> = { data: [] };
        dataset.data = Object.values(series.data ?? []) as number[];
        dataset.label = series.name;
        dataset.borderColor = this.chartOptions.categoryAxis?.enableColor ? colors : colors[colorIndex];
        dataset.backgroundColor = this.chartOptions.categoryAxis?.enableColor ? colors : colors[colorIndex];
        dataset.type = this.getChartType(seriesOptions?.type);
        if (this.type === ChartTypeEnum.Line || this.type === ChartTypeEnum.Area || this.type === ChartTypeEnum.Range) {
          dataset = dataset as ChartDataset<ChartTypeEnum.Line, number[]>;
          dataset.yAxisID = this.isHorizontal() === 'x' ? 'valueAxis' : 'categoryAxis';
          dataset.xAxisID = this.isHorizontal() === 'x' ? 'categoryAxis' : 'valueAxis';
          if (seriesOptions?.lineStyle === 'dashed') {
            dataset.borderDash = [3, 3];
          }
          if ((this.type === ChartTypeEnum.Area && !seriesOptions?.type) || seriesOptions?.type === ChartTypeEnum.Area) {
            dataset.fill = { below: transparentizeColor(colors[colorIndex], 0.4), above: transparentizeColor(colors[colorIndex], 0.4), target: 'start' };
          } else if (this.type === ChartTypeEnum.Range && this._data?.series && index === this._data.series.length - 1) {
            dataset.fill = { below: transparentizeColor(colors[colorIndex], 0.4), above: transparentizeColor(colors[colorIndex], 0.4), target: '-1' };
          }
        } else if (this.type === ChartTypeEnum.Bar || this.type === ChartTypeEnum.Column) {
          dataset = dataset as ChartDataset<ChartTypeEnum.Bar, number[]>;
          dataset.yAxisID = this.isHorizontal() === 'x' ? 'valueAxis' : 'categoryAxis';
          dataset.xAxisID = this.isHorizontal() === 'x' ? 'categoryAxis' : 'valueAxis';
        }
        chartDataset.push(dataset);
      });
    }

    return chartDataset;
  }

  private initData() {
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
        this._data = this.genericToDataView(genericData);
      }
    } catch (e) {}
  }

  private getBackgroundColor(chartOptions: XYChartOptions): string[] | undefined {
    return typeof chartOptions?.theme === 'string' ? themes.get(chartOptions?.theme as keyof typeof ThemeKey) : getCurrentTheme().colors;
  }

  private transformGenericData(sourceData: DataTableLike): GenericDataModel {
    const result: GenericDataModel = {
      dataKey: this.options?.categoryAxis?.dataKey,
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

  private getChartType(customType?: string): ChartType {
    let chartType: ChartType = 'line';
    switch (customType || this.type) {
      case ChartTypeEnum.Bar:
      case ChartTypeEnum.Column:
        chartType = 'bar';
        break;
      case ChartTypeEnum.Line:
      case ChartTypeEnum.Area:
      case ChartTypeEnum.Range:
        chartType = 'line';
        break;
      default:
        chartType = 'line';
        break;
    }
    return chartType;
  }
  private isHorizontal(): 'x' | 'y' {
    if (!this.chartOptions.categoryAxis?.position && !this.chartOptions.valueAxis?.position) {
      if (!this.chartOptions.categoryAxis) {
        this.chartOptions.categoryAxis = {};
      }
      this.chartOptions.categoryAxis.position = this.type === ChartTypeEnum.Bar ? 'left' : 'bottom';
    }
    const isHorizontal = this.chartOptions.categoryAxis?.position === 'left' || this.chartOptions.categoryAxis?.position === 'right' || this.chartOptions.valueAxis?.position === 'top' || this.chartOptions.valueAxis?.position === 'bottom';
    return isHorizontal ? 'y' : 'x';
  }
}
