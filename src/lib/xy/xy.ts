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

interface CurrentChartOptions extends XYChartOptions, ChartOptions<ChartJSType> {
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
    valueAxis: {
      gridDisplay: true,
      display: true,
      stacked: false,
    },
    legend: {
      legendPosition: 'bottom',
      legendDisplay: true,
      isLegendClick: false,
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

  private currentChartOptions: CurrentChartOptions | undefined;

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
      type: this.toChartType(this.getType()) as ChartJSType,
      data: {
        labels: chartLabels,
        datasets: chartDatasets,
      },
      options: this.currentChartOptions,
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

  private getChartOptions(): CurrentChartOptions {
    const options: CurrentChartOptions = {
      responsive: true,
      aspectRatio: this.options.aspectRatio,
      isLegendClick: this.options.legend?.isLegendClick,
      isMultipleSeries: this.options.tooltip?.isMultipleSeries,
      seriesTooltipFloor: this.options.tooltip?.seriesTooltipFloor,
      seriesTooltipFooter: this.options.tooltip?.seriesTooltipFooter,
      seriesTooltipHead: this.options.tooltip?.seriesTooltipHead,
      seriesTooltipBody: this.options.tooltip?.seriesTooltipBody,
      isMultipleLegend: this.options.tooltip?.isMultipleLegend,
      legendTooltipHead: this.options.tooltip?.legendTooltipHead,
      legendTooltipBody: this.options.tooltip?.legendTooltipBody,
      legendTooltipFooter: this.options.tooltip?.legendTooltipFooter,
      legendTooltipFloor: this.options.tooltip?.legendTooltipFloor,
      selectedLegends: [],
      onLegendClick: (selectedItem: LegendClickData[]): void => {
        this.onLegendClick(selectedItem);
      },
      onClick: chartSeriesClick,
      indexAxis: this.isHorizontal(),
      plugins: {
        title: {
          display: !!this.options.title,
          text: this.options.title,
        },
        legend: {
          display: this.options.legend?.legendDisplay,
          position: this.options.legend?.legendPosition,
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

    if (this.options.categoryAxis && this.options.valueAxis) {
      if (!this.options.categoryAxis.position) {
        this.options.categoryAxis.position = this.isHorizontal() === 'x' ? 'bottom' : 'left';
      }
      if (!this.options.valueAxis.position) {
        this.options.valueAxis.position = this.isHorizontal() === 'x' ? 'left' : 'bottom';
      }
    }

    if (
      this.options.valueAxis &&
      options.scales?.valueAxis &&
      (options.scales.valueAxis.type === 'category' || options.scales.valueAxis.type === 'time')
    ) {
      options.scales.valueAxis.position = this.options.valueAxis.position;
    }

    if (this.options.categoryAxis && options.scales?.categoryAxis) {
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

    if (this.options.valueAxis && options.scales?.valueAxis) {
      options.scales.valueAxis = {
        stacked: this.options.valueAxis.stacked,
        title: {
          display: !!this.options.valueAxis.title,
          text: this.options.valueAxis.title,
        },
        grid: {
          display: this.options.valueAxis.gridDisplay,
        },
        display: this.options.valueAxis.display,
      };

      if (this.options.valueAxis.position) {
        options.scales.valueAxis.position = this.options.valueAxis.position;
      }
    }
    console.log('options', options);

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
    dataset.type = this.toChartType(styleMapping?.type);
    dataset = this.setAxisIDs(dataset);
    if (dataset.type === 'line') {
      dataset = dataset as ChartDataset<ChartType.Line, number[]>;
      if (styleMapping?.lineStyle === 'dashed') {
        dataset.borderDash = [3, 3];
      }
    }
    return this.afterDatasetCreated(dataset, { styleMapping: styleMapping }, index);
  }
  private setAxisIDs(dataset: ChartDataset<ChartJSType, number[]>): ChartDataset<ChartJSType, number[]> {
    dataset = dataset as ChartDataset<ChartType.Bar, number[]> | ChartDataset<ChartType.Line, number[]>;
    dataset.yAxisID = this.isHorizontal() === 'x' ? 'valueAxis' : 'categoryAxis';
    dataset.xAxisID = this.isHorizontal() === 'x' ? 'categoryAxis' : 'valueAxis';
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

  private toChartType(type?: string): ChartJSType {
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
    if (!this.options.categoryAxis?.position && !this.options.valueAxis?.position) {
      if (!this.options.categoryAxis) {
        this.options.categoryAxis = {};
      }
      this.options.categoryAxis.position = this.getType() === ChartType.Bar ? 'left' : 'bottom';
    }
    const isHorizontal =
      this.options.categoryAxis?.position === 'left' ||
      this.options.categoryAxis?.position === 'right' ||
      this.options.valueAxis?.position === 'top' ||
      this.options.valueAxis?.position === 'bottom';
    return isHorizontal ? 'y' : 'x';
  }

  private onLegendClick(selectedItem: LegendClickData[]): void {
    const options = {
      detail: { selectedItem: selectedItem },
      bubbles: true,
      composed: true,
    };
    // this.dispatchEvent(new CustomEvent('legendClick', options));
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
