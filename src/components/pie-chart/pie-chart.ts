import { Chart, ChartDataset, ChartOptions } from 'chart.js/auto';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { merge } from 'lodash-es';
import { COMPONENT_PREFIX } from '../../core';
import { ChartA11y, ChartLegendA11y, legendClickHandler } from '../../core/plugins';
import { LegendClickData } from '../../core/plugins/plugin.types';
import { chartOptions, themes } from '../../types';
import { defaultPieChartOptions } from './pie-chart.options';
import { CenterValue } from './pie-chart.plugins';
import { PieChartOptions } from './pie-chart.types';

interface PieChartJsOptions extends ChartOptions<'pie'> {
  isLegendClick?: boolean;
  centerLabel?: string | number;
  chartLabel?: string | number | string[];
  onLegendClick?: (legendItem: { label: string | number; value: string | number }) => void;
}

@customElement(`${COMPONENT_PREFIX}-pie`)
class PieChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    * {
      padding: 0;
      margin: 0;
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  `;

  @property({ type: Array, hasChanged: () => true })
  data: Record<string, unknown>[] | Record<string, unknown> | undefined = [];

  @property({ type: Object, hasChanged: () => true })
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

    const chartLabel = Array.isArray(this.data) ? Object.keys(this.data[0]) : Object.keys(this.data as Record<string, unknown>);
    this.chartOptions = merge({}, chartOptions, defaultPieChartOptions, this.options);
    const chartJsDataset = this.handleChartDataset();
    const chartJsOptions = this.handleChartOptions();

    if (ctx) {
      this.chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: chartLabel,
          datasets: chartJsDataset,
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
      centerLabel: this.chartOptions.centerLabel,
      cutout: this.chartOptions.cutout,
      chartLabel: this.chartOptions.chartLabel,
      aspectRatio: this.chartOptions.aspectRatio,
      isLegendClick: this.chartOptions.isLegendClick,
      onLegendClick: (selectedItem: LegendClickData): void => {
        this.onLegendClick(selectedItem);
      },
      plugins: {
        legend: {
          display: this.chartOptions.legendDisplay,
          position: this.chartOptions.legendPosition,
          labels: {
            boxWidth: this.chartOptions.legendLabelsWidth,
            boxHeight: this.chartOptions.legendLabelsHeight,
          },
          onClick: legendClickHandler,
        },
      },
    };
    return chartOptions;
  }

  private handleChartDataset(): ChartDataset<'pie', number[]>[] {
    const chartDataset: ChartDataset<'pie', number[]>[] = [];
    if (!this.data) {
      return chartDataset;
    }

    if (Array.isArray(this.data)) {
      this.data?.forEach((data, index) => {
        chartDataset.push({
          data: Object.values(data) as number[],
          label: typeof this.chartOptions.chartLabel === 'string' ? this.chartOptions.chartLabel : (this.chartOptions.chartLabel as string[])[index],
          backgroundColor: this.getBackgroundColor(this.chartOptions),
        });
      });
    } else {
      chartDataset[0] = {
        data: Object.values(this.data) as number[],
        label: this.chartOptions.chartLabel as string,
        backgroundColor: this.getBackgroundColor(this.chartOptions),
      };
    }
    return chartDataset;
  }

  private getBackgroundColor(chartOptions: PieChartOptions): string[] | undefined {
    return typeof chartOptions?.theme === 'string' ? themes[chartOptions?.theme as keyof typeof themes] : chartOptions?.theme;
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

export { PieChart };
