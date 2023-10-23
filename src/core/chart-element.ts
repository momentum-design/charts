import { Chart as ChartJS, ChartConfiguration, ChartConfigurationCustomTypesPerDataset } from 'chart.js/auto';
import { css, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ChartOptions } from '../types';

/**
 * A base class for all chart elements.
 *
 * @example
 * You can implement a specific chart by following code.
 * ```ts
 * @customElement(`hello-chart`)
 * class HelloChart extends ChartElement<HelloChartData, HelloChartOptions> {
 *  // members
 * }
 * ```
 *
 * @typeParam TOptions - the type of chart options
 * @typeParam TData - the type of chart data
 */
export abstract class ChartElement<TOptions extends ChartOptions, TData> extends LitElement {
  instance?: ChartJS;

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
  `;

  /**
   * The data for current chart.
   */
  @property({ type: Object, hasChanged: () => true })
  data?: TData;

  /**
   * The options for current chat.
   */
  @property({ type: Object, hasChanged: () => true })
  options?: TOptions;

  constructor() {
    super();
  }

  firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
    this.initChart();
  }

  /**
   * @inheritDoc
   */
  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('resize', this.resizeChart);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeChart);
  }

  render(): TemplateResult {
    return html`<canvas></canvas>`;
  }

  updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);
    if ((changedProperties.has('data') || changedProperties.has('options')) && this.instance) {
      this.updateChart();
    }
  }

  /**
   * Initializes and renders the chart.
   */
  protected initChart(): void {
    this.instance = new ChartJS(this.renderRoot.querySelector('canvas') as HTMLCanvasElement, this.getChartJSConfiguration());
  }

  /**
   * Resizes the chart that will be useful if the window changed.
   */
  protected resizeChart(): void {
    console.log('resize');
    this.instance?.resize();
  }

  /**
   * Updates the chart.
   */
  protected updateChart(): void {
    if (this.instance) {
      // TODO: just update the changes
      this.instance.update();
    }
  }

  /**
   * You can convert the data and options to ChartJS configuration here so that can be used for ChartJS.
   */
  protected abstract getChartJSConfiguration(): ChartConfiguration | ChartConfigurationCustomTypesPerDataset;
}
