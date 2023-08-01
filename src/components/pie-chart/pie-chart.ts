import { Chart } from 'chart.js/auto';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { merge } from 'lodash-es';
import { globalStyleOptions, themes } from '../../core/common/global-style';
import { ChartA11y, ChartLegendA11y } from '../../core/plugins';
import { LegendClickData } from '../../core/plugins/plugin.types';
import { defaultPieChartOptions, pieChartData } from './pie-chart.options';
import { CenterValue } from './pie-chart.plugins';
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
    const chartLabel = this.label;

    this.chartOptions = {
      legendClickCallback: (selectedItem: LegendClickData) => {
        this.legendClickCallback(selectedItem);
      },
    };
    this.chartOptions = merge(this.chartOptions, defaultPieChartOptions, globalStyleOptions, this.options);

    const chartDataset = this.handleChartDataset();

    if (ctx) {
      this.chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: chartLabel,
          datasets: [chartDataset],
        },
        options: this.chartOptions,
        plugins: [ChartA11y, ChartLegendA11y, CenterValue],
      });
    }
  }

  private legendClickCallback(selectedItem: LegendClickData): void {
    const options = {
      detail: { selectedItem },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('legendClick', options));
  }

  private handleChartDataset(): PieChartData {
    const chartDataset = merge({}, this.data, pieChartData.data);
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

export { PieChart };
