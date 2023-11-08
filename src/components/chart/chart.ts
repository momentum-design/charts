/* eslint-disable @typescript-eslint/no-empty-interface */
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { COMPONENT_PREFIX } from '../../core';
import { createChart } from '../../lib';
import { Chart } from '../../lib/.internal';
import { ChartData, ChartOptions, ChartTypeEnum } from '../../types';

/**
 * The chart component for rendering all charts that extends {@link LitElement}.
 *
 * @category Components
 *
 * @example
 * ```html
 * <mdw-chart data='{
 *    "Alabama": 13,
 *    "Colorado": 17,
 *    "Arizona": 8,
 *    "Vermont": 10}'
 *  options='{"type": "pie"}'></mdw-chart>
 * ```
 *
 * @typeParam TData - the type of chart data
 * @typeParam TOptions - the type of chart options
 */
@customElement(`${COMPONENT_PREFIX}-chart`)
export class ChartComponent<TData extends ChartData, TOptions extends ChartOptions> extends LitElement {
  chart?: Chart<ChartData, ChartOptions>;

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
  `;

  /**
   * Type of the chart.
   *
   * Should be one of:
   * - `pie`
   * - `gauge`
   * - `doughnut`
   * - `bar`
   * - `column`
   * - `line`
   * - `area`
   * - `range`
   * - `wordCloud`
   */
  @property({ type: String, reflect: true })
  type?: string;

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
    if (changedProperties.has('data') || changedProperties.has('options')) {
      this.updateChart();
    }
  }

  /**
   * Resizes the chart and something else that will be useful if the window changed.
   */
  protected handleResize(): void {
    this.chart?.resize();
  }

  /**
   * Initializes and renders the chart.
   */
  protected initChart(): void {
    if (this.data && this.type) {
      this.chart = createChart(this.type as ChartTypeEnum, this.data, this.options);
      this.chart.render(this.renderRoot.querySelector('canvas') as HTMLCanvasElement);
    }
  }

  /**
   * Updates the chart.
   */
  protected updateChart(): void {
    this.chart?.update();
  }
}
