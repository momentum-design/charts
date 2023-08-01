import { Chart } from 'chart.js/auto';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { merge } from 'lodash-es';
import { globalStyleOptions, themes } from '../../core/common/global-style';
import { ChartA11y } from '../../core/plugins';
import { defaultGaugeChartOptions, gaugeChartData } from './gauge-chart.options';
import { GaugeNeedle } from './gauge-chart.plugins';
import { GaugeChartData, GaugeChartOptions } from './gauge-chart.types';

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

    this.chartOptions = merge({}, defaultGaugeChartOptions, globalStyleOptions, this.options);
    const chartDataset = this.handleChartDataset();

    if (ctx) {
      this.chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: chartLabel,
          datasets: [chartDataset],
        },
        options: this.chartOptions,
        plugins: [GaugeNeedle, ChartA11y],
      });
    }
  }

  private handleChartDataset(): GaugeChartData {
    const chartDataset = merge({}, gaugeChartData.data, this.data);
    if (typeof this.chartOptions?.theme === 'string') {
      chartDataset.backgroundColor = themes[this.chartOptions?.theme as keyof typeof themes];
    }
    return chartDataset;
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
