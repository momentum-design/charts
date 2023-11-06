import { Chart as ChartJS, ChartConfiguration, ChartConfigurationCustomTypesPerDataset } from 'chart.js/auto';
import { css, html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ChartOptions } from '../types';

/**
 * A base class for all chart elements that extends {@link LitElement}.
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
 * @typeParam TData - the type of chart data
 * @typeParam TOptions - the type of chart options
 */
export abstract class ChartElement<TData, TOptions extends ChartOptions> extends LitElement {
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

  #boundResizeHandler: () => void;

  constructor() {
    super();
    this.#boundResizeHandler = this.handleResize.bind(this);
  }

  firstUpdated(changedProperties: Map<PropertyKey, unknown>): void {
    if (!this.options || !this.data) {
      throw new Error('The options and data properties are required.');
    }
    this.initChart();
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('resize', this.#boundResizeHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.#boundResizeHandler);
  }

  render(): TemplateResult {
    if (this.id) {
      return html`<canvas id="${this.id}_container"></canvas>`;
    }
    return html`<canvas></canvas>`;
  }

  updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);
    if ((changedProperties.has('data') || changedProperties.has('options')) && this.instance) {
      this.updateChart();
    }
  }

  /**
   * Resizes the chart and something else that will be useful if the window changed.
   */
  protected handleResize(): void {
    this.instance?.resize();
  }

  /**
   * Initializes and renders the chart.
   */
  protected initChart(): void {
    const config = this.getChartJSConfiguration();
    if (config) {
      this.instance = new ChartJS(this.renderRoot.querySelector('canvas') as HTMLCanvasElement, config);
    }
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
  protected abstract getChartJSConfiguration(): ChartConfiguration | ChartConfigurationCustomTypesPerDataset | null;
}
