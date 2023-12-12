/* eslint-disable @typescript-eslint/no-empty-interface */
import { css, CSSResult, CSSResultGroup, CSSResultOrNative, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { COMPONENT_PREFIX } from '../../core';
import { wrapSelector } from '../../helpers';
import { createChart } from '../../lib';
import { Chart } from '../../lib/.internal';
import { ChartData, ChartOptions, ChartType } from '../../types';

const tag = `${COMPONENT_PREFIX}-chart`;

/**
 * The chart component for rendering all charts that extends {@link LitElement}.
 *
 * @category Components
 *
 * @example
 * ```html
 * <mdw-chart type="pie"
 *   data='{
 *    "Alabama": 13,
 *    "Colorado": 17,
 *    "Arizona": 8,
 *    "Vermont": 10}'
 * ></mdw-chart>
 * ```
 *
 * @typeParam TData - the type of chart data
 * @typeParam TOptions - the type of chart options
 */
@customElement(tag)
export class ChartComponent<TData extends ChartData, TOptions extends ChartOptions> extends LitElement {
  static tag = tag;
  static disableShadowRoot = true;
  static get styles(): CSSResult {
    return css`
      ${wrapSelector(this, ':host')} {
        display: block;
        position: relative;
      }
    `;
  }

  chart?: Chart<ChartData, ChartOptions>;

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

  private boundResizeHandler: () => void;

  constructor() {
    super();
    this.boundResizeHandler = this.handleResize.bind(this);
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('resize', this.boundResizeHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.boundResizeHandler);
  }

  render(): TemplateResult {
    if (this.id) {
      return html`<canvas id="${this.id}_container"></canvas>`;
    }
    return html`<canvas></canvas>`;
  }

  updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('type') || changedProperties.has('data') || changedProperties.has('options')) {
      this.initChart();
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
      if (this.options) {
        this.options.aspectRatio = this.clientWidth / this.clientHeight;
      }
      this.chart = createChart(this.type as ChartType, this.data, this.options);
      const canvasElement = this.renderRoot.querySelector('canvas') as HTMLCanvasElement;
      if (canvasElement) {
        canvasElement.width = this.clientWidth;
        canvasElement.height = this.clientHeight;
      }
      this.chart.render(canvasElement);
    }
  }

  /**
   * Updates the chart.
   */
  protected updateChart(): void {
    this.chart?.update();
  }

  protected static finalizeStyles(styles?: CSSResultGroup): CSSResultOrNative[] {
    let elementStyles = super.finalizeStyles(styles);
    const styleRoot = document.head;
    if (this.disableShadowRoot) {
      // WARNING: This break component encapsulation and applies styles to the document.
      // These styles should be manually scoped.
      elementStyles.forEach((s: CSSResultOrNative) => {
        const style = document.createElement('style');
        if (s instanceof CSSResult) {
          style.textContent = s.cssText;
        }
        styleRoot.appendChild(style);
      });
      elementStyles = [];
    }
    return elementStyles;
  }
}
