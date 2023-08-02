import { Chart, ChartDataset, ChartOptions } from 'chart.js/auto';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { merge } from 'lodash-es';
import { chartOptions, themes } from '../../core/common/chart.types';
import { ChartA11y } from '../../core/plugins';
import { defaultGaugeChartOptions } from './gauge-chart.options';
import { GaugeNeedle } from './gauge-chart.plugins';
import { GaugeChartData, GaugeChartOptions } from './gauge-chart.types';

interface ChartJsDataset extends ChartDataset<'doughnut', number[]> {
  value?: number;
}

@customElement('wc-gauge')
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

  @property({ type: Object, hasChanged: () => true })
  data: GaugeChartData | undefined = undefined;

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
    const chartLabel = this.label;

    this.chartOptions = merge({}, chartOptions, defaultGaugeChartOptions, this.options);
    const chartJsDataset = this.handleChartDataset();
    const chartJsOptions = this.handleChartOptions();

    if (ctx) {
      this.chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: chartLabel,
          datasets: [chartJsDataset],
        },
        options: chartJsOptions,
        plugins: [GaugeNeedle, ChartA11y],
      });
    }
  }

  private handleChartOptions(): ChartOptions<'doughnut'> {
    const chartOptions: ChartOptions<'doughnut'> = {
      responsive: this.chartOptions.responsive,
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
          display: this.chartOptions.legendDisplay,
        },
      },
    };
    return chartOptions;
  }

  private handleChartDataset(): ChartJsDataset {
    if (this.data) {
      const chartDataset: ChartJsDataset = {
        data: this.data.data,
        value: this.data.value,
        backgroundColor: typeof this.chartOptions?.theme === 'string' ? themes[this.chartOptions?.theme as keyof typeof themes] : this.chartOptions?.theme,
      };
      return chartDataset;
    } else {
      return {
        data: [],
      };
    }
  }

  updateChart(): void {
    if (this.chartInstance) {
      const chartDataset = this.handleChartDataset();
      this.chartInstance.data.datasets = [chartDataset];
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
