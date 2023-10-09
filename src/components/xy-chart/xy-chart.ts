import { Chart, ChartDataset, ChartOptions, ChartType } from 'chart.js/auto';
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
import { XYChartOptions } from './xy-chart.types';

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
  data: { labels?: string[]; data?: [{ label: string; data: number[] }] } = {};

  @property({ type: Object, hasChanged: () => true })
  options: XYChartOptions = {};

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
    super.updated(changedProperties);
    if ((changedProperties.has('data') || changedProperties.has('options')) && this.chartInstance) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (this.chartInstance) {
      const chartDataset = this.handleChartDataset();
      this.chartInstance.data.datasets = chartDataset;
      this.chartInstance.destroy();
      this.initializeChart();
    }
  }

  firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('data')) {
      this.initializeChart();
    }
  }

  protected render() {
    return html`<canvas></canvas>`;
  }

  private initializeChart(): void {
    debugger;
    const container = this.renderRoot.querySelector('.container');
    const chartLabels = this.data?.labels;
    this.chartOptions = merge({}, defaultOptions, this.options);
    const chartJsDataset = this.handleChartDataset();
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
          datasets: chartJsDataset,
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
    return {
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
          stacked: this.chartOptions.stacked ?? false,
          title: {
            display: !!this.chartOptions.xTitle,
            text: this.chartOptions.xTitle,
          },
          grid: {
            display: this.chartOptions.xGridDisplay ?? true,
          },
        },
        y: {
          stacked: this.chartOptions.stacked ?? false,
          title: {
            display: !!this.chartOptions.yTitle,
            text: this.chartOptions.yTitle,
          },
          grid: {
            display: this.chartOptions.yGridDisplay ?? true,
          },
        },
      },
    };
  }

  private handleChartDataset(): ChartDataset<ChartType, number[]>[] {
    const chartDataset: ChartDataset<ChartType, number[]>[] = [];
    if (!this.data?.data) {
      return chartDataset;
    }
    if (Array.isArray(this.data?.data)) {
      const colors = this.getBackgroundColor(this.chartOptions) ?? [];
      this.data.data?.forEach((data, index) => {
        const colorIndex = index % colors.length;
        let dataset: ChartDataset<ChartType, number[]> = { data: [] };
        dataset.data = Object.values(data.data) as number[];
        dataset.label = data.label;
        dataset.borderColor = this.chartOptions.multiColor ? colors : colors[colorIndex];
        dataset.backgroundColor = this.chartOptions.multiColor ? colors : colors[colorIndex];

        if (this.type === ChartTypeEnum.Line) {
          dataset = dataset as ChartDataset<ChartTypeEnum.Line, number[]>;
          if (this.chartOptions.lineStyle === 'dashed') {
            dataset.borderDash = [3, 3];
          }
          if (this.chartOptions.visualStyle === 'area') {
            dataset.fill = { below: transparentizeColor(colors[colorIndex], 0.4), above: transparentizeColor(colors[colorIndex], 0.4), target: 'start' };
          } else if (this.chartOptions.visualStyle === 'range' && this.data.data && index === this.data.data.length - 1) {
            dataset.fill = { below: transparentizeColor(colors[colorIndex], 0.4), above: transparentizeColor(colors[colorIndex], 0.4), target: '-1' };
          }
        }
        chartDataset.push(dataset);
      });
    }

    return chartDataset;
  }

  private getBackgroundColor(chartOptions: XYChartOptions): string[] | undefined {
    return typeof chartOptions?.theme === 'string' ? themes.get(chartOptions?.theme as keyof typeof ThemeKey) : getCurrentTheme().colors;
  }
}
