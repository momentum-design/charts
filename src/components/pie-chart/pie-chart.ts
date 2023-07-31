import { Chart } from 'chart.js/auto';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ChartA11y, ChartLegendA11y } from '../../core/plugins';
import { themes } from '../gauge-chart';
import { defaultPieChartOptions, pieChartData } from './pie-chart.options';
import { PieChartData, PieChartOptions } from './pie-chart.types';

@customElement('wc-pie')
class PieChart extends LitElement {
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
  data: PieChartData | undefined = undefined;

  @property({ type: Object })
  options: PieChartOptions | undefined = undefined;

  @property({ type: Array })
  label: string[] | undefined = [];

  private chartInstance: Chart | any = null;
  private chartOptions!: PieChartOptions;

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

    this.chartOptions = {
      responsive: true,
      cutout: this.options?.cutout ?? defaultPieChartOptions.cutout,
      theme: this.options?.theme ?? defaultPieChartOptions.theme,
      aspectRatio: this.options?.aspectRatio ?? defaultPieChartOptions.aspectRatio,
      isLegendFilter: this.options?.isLegendFilter ?? defaultPieChartOptions.isLegendFilter,
      legendFilterCallback: (selectedItem: any) => {
        this.legendFilterCallback(selectedItem);
      },
      plugins: {
        legend: {
          display: this.options?.plugins?.legend?.display ?? defaultPieChartOptions.plugins?.legend?.display,
          position: this.options?.plugins?.legend?.position ?? defaultPieChartOptions.plugins?.legend?.position,
          onClick: defaultPieChartOptions.plugins?.legend?.onClick,
        },
      },
    };

    const chartDataset = this.handleChartDataset();
    const chartLabel = this.label;

    if (ctx) {
      this.chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: chartLabel,
          datasets: [chartDataset],
        },
        options: this.chartOptions,
        plugins: [ChartA11y, ChartLegendA11y],
      });
    }
  }

  private handleChartDataset(): PieChartData {
    const chartDataset: PieChartData = {
      data: this.data?.data || pieChartData.data,
      label: this.data?.label || pieChartData.label,
      backgroundColor: typeof this.chartOptions.theme === 'string' ? themes[this.chartOptions?.theme as keyof typeof themes] : this.options?.theme,
    };
    return chartDataset;
  }

  private legendFilterCallback(selectedItem: any): void {
    const options = {
      detail: { selectedItem },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('contextualFilter', options));
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

export { PieChart };
