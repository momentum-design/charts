import { Chart, ChartDataset, ChartOptions, ChartType } from 'chart.js/auto';
import 'chartjs-adapter-moment';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { merge } from 'lodash-es';
import { COMPONENT_PREFIX, ThemeKey, themes } from '../../core';
import { defaultOptions } from '../../core/chart-options';
import { chartA11y, chartLegendA11y, chartSeriesClick, legendClickHandler, legendHandleHover, legendHandleLeave } from '../../core/plugins';
import { externalTooltipHandler } from '../../core/plugins/chart-tooltip';
import { LegendClickData } from '../../core/plugins/plugin.types';
import { getCurrentTheme, transparentizeColor } from '../../core/utils';
import { ChartTypeEnum } from '../../types';
import { defaultXYChartOptions } from './xy-chart.options';
import { DataTableLike, DataView, GenericDataModel, XYChartOptions } from './xy-chart.types';

interface CurrentChartOptions extends ChartOptions<ChartType> {
  fill?: boolean;
  indexAxis: 'x' | 'y';
  customizeColor?: boolean;
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
 * @ignore
 */
@customElement(`${COMPONENT_PREFIX}-xy`)
export class XYChart extends LitElement {
  public static styles = css`
    :host {
      display: block;
      position: relative;
    }
  `;

  @property({ type: String, hasChanged: () => true })
  type: ChartTypeEnum = ChartTypeEnum.Line;

  @property({ type: Object, hasChanged: () => true })
  data: DataTableLike | string | undefined = undefined;

  @property({ type: Object, hasChanged: () => true })
  options: XYChartOptions = {};

  /**
   * Internal data displayed on the chart.
   */
  @property({ type: Object }) _data: DataView | undefined = undefined;

  private chartInstance: Chart | undefined;
  private chartOptions!: XYChartOptions;
  private currentChartOptions: CurrentChartOptions | undefined;

  constructor() {
    super();
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('resize', this.handleWindowResize);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize(): void {
    this.chartInstance?.resize();
  }

  updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('type')) this.typeChanged();
    if (changedProperties.has('data')) this.dataChanged();
    if (changedProperties.has('_data') || changedProperties.has('options')) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.initializeChart();
  }

  firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('_data')) {
      this.initializeChart();
    }
  }

  protected render() {
    return html`<canvas></canvas>`;
  }
  private typeChanged(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.initializeChart();
    }
  }

  private initializeChart(): void {
    debugger;
    if (!this._data) {
      return;
    }
    const container = this.renderRoot.querySelector('.container');
    const chartLabels = this._data.category.labels;
    this.chartOptions = merge({}, defaultOptions, defaultXYChartOptions, this.options);
    const chartDatasets = this.handleChartDataset();
    this.currentChartOptions = this.handleChartOptions();
    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    if (container) {
      this.currentChartOptions.maintainAspectRatio = false;
      this.currentChartOptions.aspectRatio = this.clientWidth / this.clientHeight;
      canvas.width = this.clientWidth;
      canvas.height = this.clientHeight;
    }
    const ctx = canvas.getContext('2d');

    if (ctx) {
      this.chartInstance = new Chart(ctx, {
        type: this.type,
        data: {
          labels: chartLabels,
          datasets: chartDatasets,
        },
        options: this.currentChartOptions,
        plugins: [chartA11y, chartLegendA11y],
      });
    }
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
      indexAxis: this.chartOptions.indexAxis ?? 'x',
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
        x: {
          position: this.chartOptions.xPosition,
          stacked: this.chartOptions.xStacked ?? false,
          title: {
            display: !!this.chartOptions.xTitle,
            text: this.chartOptions.xTitle,
          },
          grid: {
            display: this.chartOptions.xGridDisplay,
          },
        },
        y: {
          position: this.chartOptions.yPosition,
          stacked: this.chartOptions.yStacked ?? false,
          title: {
            display: !!this.chartOptions.yTitle,
            text: this.chartOptions.yTitle,
          },
          grid: {
            display: this.chartOptions.yGridDisplay,
          },
        },
      },
    };
    if (this.chartOptions.categoryIsTime && options.scales?.x) {
      options.scales.x.type = 'time';
      if (options.scales.x.type === 'time' && this.chartOptions.timeOptions) {
        options.scales.x.time = { unit: this.chartOptions.timeOptions.unit };
        if (this.chartOptions.timeOptions.dateFormat) {
          options.scales.x.time.displayFormats = {
            [this.chartOptions.timeOptions.unit as string]: this.chartOptions.timeOptions.dateFormat,
          };
        }
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
        const colorIndex = index % colors.length;
        let dataset: ChartDataset<ChartType, number[]> = { data: [] };
        dataset.data = Object.values(series.data ?? []) as number[];
        dataset.label = series.name;
        dataset.borderColor = this.chartOptions.multiColor ? colors : colors[colorIndex];
        dataset.backgroundColor = this.chartOptions.multiColor ? colors : colors[colorIndex];

        if (this.type === ChartTypeEnum.Line) {
          dataset = dataset as ChartDataset<ChartTypeEnum.Line, number[]>;
          if (this.chartOptions.lineStyle === 'dashed') {
            dataset.borderDash = [3, 3];
          }
          if (this.chartOptions.visualStyle === 'area') {
            dataset.fill = { below: transparentizeColor(colors[colorIndex], 0.4), above: transparentizeColor(colors[colorIndex], 0.4), target: 'start' };
          } else if (this.chartOptions.visualStyle === 'range' && this._data?.series && index === this._data.series.length - 1) {
            dataset.fill = { below: transparentizeColor(colors[colorIndex], 0.4), above: transparentizeColor(colors[colorIndex], 0.4), target: '-1' };
          }
        }
        chartDataset.push(dataset);
      });
    }

    return chartDataset;
  }

  /**
   * Handles changes to the `data` attribute.
   */
  private dataChanged() {
    let data: DataTableLike = [];
    if (!this.data) {
      return;
    }
    try {
      if (this.data instanceof String) {
        data = JSON.parse(this.data as string) as DataTableLike;
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
      categoryKey: this.options?.categoryKey,
      data: [],
    };

    if (typeof sourceData[0] === 'object' && !Array.isArray(sourceData[0])) {
      const data = sourceData as Record<string, string | number>[];
      result.categoryKey = result.categoryKey ?? Object.keys(data[0])[0];
      result.data = data;
    } else if (Array.isArray(sourceData[0])) {
      const data = sourceData as unknown[][];
      const columns = data[0] as string[];
      const rows = data.slice(1);
      result.categoryKey = result.categoryKey ?? columns[0];
      rows.forEach((row: unknown[]) => {
        const item: {
          [key: string]: string | number;
        } = {};
        columns.forEach((column: string, index) => {
          item[column] = row[index] as string | number;
        });
        if (result.data) {
          result.data.push(item);
        } else {
          result.data = [item];
        }
      });
    }
    return result;
  }

  private genericToDataView(data: GenericDataModel): DataView {
    const result: DataView = {
      category: {
        name: data.categoryKey ?? '',
        labels: [],
      },
      series: [],
    };

    if (!data?.categoryKey) {
      return result;
    }
    result.category.labels = data.data.map((item) => item[data.categoryKey as string]);
    const seriesNames = Object.keys(data.data[0]).filter((key) => key !== data.categoryKey);

    const seriesData = seriesNames.map((name) => {
      return {
        name: name,
        data: data.data.map((item) => item[name] as number),
      };
    });

    result.series = seriesData;
    console.log('genericToDataView', result);

    return result;
  }
}
