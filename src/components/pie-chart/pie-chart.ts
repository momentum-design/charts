import { Chart, ChartOptions } from 'chart.js/auto';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { merge } from 'lodash-es';
import { chartOptions, themes } from '../../core/common/chart.types';
import { ChartA11y, ChartLegendA11y, legendClickHandler } from '../../core/plugins';
import { LegendClickData } from '../../core/plugins/plugin.types';
import { defaultPieChartOptions } from './pie-chart.options';
import { CenterValue } from './pie-chart.plugins';
import { PieChartData, PieChartOptions } from './pie-chart.types';

interface PieChartJsOptions extends ChartOptions<'pie'> {
  isLegendClick?: boolean;
  onLegendClick?: (legendItem: { label: string | number; value: string | number }) => void;
}

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

    this.chartOptions = merge({}, chartOptions, defaultPieChartOptions, this.options);
    const chartJsDataset = this.handleChartDataset();
    const chartJsOptions = this.handleChartOptions();

    if (ctx) {
      this.chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: chartLabel,
          datasets: [chartJsDataset],
        },
        options: chartJsOptions,
        plugins: [ChartA11y, ChartLegendA11y, CenterValue],
      });
    }
  }

  private onLegendClick(selectedItem: LegendClickData): void {
    const options = {
      detail: { selectedItem },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('legendClick', options));
  }

  private handleChartOptions(): PieChartJsOptions {
    const chartOptions: PieChartJsOptions = {
      responsive: this.chartOptions.responsive,
      cutout: this.chartOptions.cutout,
      aspectRatio: this.chartOptions.aspectRatio,
      isLegendClick: this.chartOptions.isLegendClick,
      onLegendClick: (selectedItem: LegendClickData): void => {
        this.onLegendClick(selectedItem);
      },
      plugins: {
        legend: {
          display: this.chartOptions.legendDisplay,
          position: this.chartOptions.legendPosition,
          onClick: legendClickHandler,
        },
      },
    };
    return chartOptions;
  }

  private handleChartDataset(): PieChartData {
    if (this.data) {
      const chartDataset: PieChartData = {
        data: this.data.data,
        label: this.data.label,
        centerLabel: this.data.centerLabel,
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

export { PieChart };
