import { Chart, ChartDataset, ChartOptions } from 'chart.js/auto';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { merge } from 'lodash-es';
import { COMPONENT_PREFIX, ThemeKey, themes } from '../../core';
import { defaultChartOptions } from '../../core/chart-options';
import { chartA11y } from '../../core/plugins';
import { getCurrentTheme } from '../../core/utils';
import { defaultGaugeChartOptions } from './gauge-chart.options';
import { gaugeNeedle } from './gauge-chart.plugins';
import { GaugeChartOptions } from './gauge-chart.types';

interface ChartJsOptions extends ChartOptions<'doughnut'> {
  value?: number;
  circumference?: number;
  rotation?: number;
}

@customElement(`${COMPONENT_PREFIX}-gauge`)
class GaugeChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  `;

  @property({ type: Array || Object, hasChanged: () => true })
  data: Record<string, unknown>[] | Record<string, unknown> | undefined = [];

  @property({ type: Object })
  options: GaugeChartOptions | undefined = undefined;

  @property({ type: Array })
  label: string[] | undefined = [];

  private chartInstance: Chart | any = null;
  private chartOptions!: GaugeChartOptions;

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

  private initializeChart(): void {
    const canvas = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const chartLabel = Array.isArray(this.data) ? Object.keys(this.data[0]) : Object.keys(this.data as Record<string, unknown>);
    this.chartOptions = merge({}, defaultChartOptions, defaultGaugeChartOptions, this.options);
    const chartJsDataset = this.handleChartDataset();
    const chartJsOptions = this.handleChartOptions();

    if (ctx) {
      this.chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: chartLabel,
          datasets: chartJsDataset,
        },
        options: chartJsOptions,
        plugins: [gaugeNeedle, chartA11y],
      });
    }
  }

  private handleChartOptions(): ChartJsOptions {
    const chartOptions: ChartJsOptions = {
      responsive: this.chartOptions.responsive,
      value: this.chartOptions.value,
      cutout: this.chartOptions.cutout,
      aspectRatio: this.chartOptions.aspectRatio,
      circumference: this.chartOptions.circumference,
      rotation: this.chartOptions.rotation,
      layout: {
        padding: {
          left: this.chartOptions.paddingLeft,
          right: this.chartOptions.paddingRight,
        },
      },
      plugins: {
        legend: {
          display: this.chartOptions.legend?.legendDisplay,
        },
      },
    };
    return chartOptions;
  }

  private handleChartDataset(): ChartDataset<'doughnut', number[]>[] {
    const chartDataset: ChartDataset<'doughnut', number[]>[] = [];
    if (!this.data) {
      return [];
    }
    const chartJsData = Array.isArray(this.data) ? Object.values(this.data[0]) : Object.values(this.data);
    chartDataset[0] = {
      data: chartJsData as number[],
      backgroundColor: typeof this.chartOptions?.theme === 'string' ? themes.get(this.chartOptions?.theme as keyof typeof ThemeKey) : getCurrentTheme().colors,
    };
    return chartDataset;
  }

  updateChart(): void {
    if (this.chartInstance) {
      const chartDataset = this.handleChartDataset();
      this.chartInstance.data.datasets = chartDataset;
      this.chartInstance.update();
    }
  }

  firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('data') || changedProperties.has('options')) {
      this.initializeChart();
    }
  }

  render(): TemplateResult {
    return html`<canvas></canvas>`;
  }
}

export { GaugeChart };
