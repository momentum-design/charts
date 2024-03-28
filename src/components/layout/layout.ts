import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { COMPONENT_PREFIX } from '../../core';
import { mergeObjects } from '../../helpers';
import { ChartEventType } from '../../types';
import { LayoutData, LayoutOptions } from './layout.types';

@customElement(`${COMPONENT_PREFIX}-layout`)
export class LayoutComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    .mdw-layout-item {
      background-color: #fff;
      position: absolute;
      box-sizing: border-box;
    }
  `;

  @property({ type: Object, hasChanged: () => true })
  data?: LayoutData[] = [];

  @property({ type: Object, hasChanged: () => true })
  options!: LayoutOptions;

  private defaultOptions: LayoutOptions = {
    gap: 10,
    cols: 6,
    cellHeight: 30,
  };

  constructor() {
    super();
    this.addEventListener(ChartEventType.BoxRenderComplete, (event) => this.handleBoxRendered(event));
  }

  render() {
    return html`
      ${repeat(
        this.data!,
        (item) => item,
        (item, index) => html`
          <div id="widget-${item.id}" class="mdw-layout-item">
            <slot name="${item.id}"></slot>
          </div>
        `,
      )}
    `;
  }

  updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('data')) {
      this.options = mergeObjects(this.defaultOptions, this.options);
      this.setContainerHeight();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    const layoutElement = this.closest('mdw-layout');
    if (!layoutElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.renderBoxes();
      }
    });

    resizeObserver.observe(layoutElement);
  }

  private setContainerHeight(): void {
    const layoutElement = this.closest('mdw-layout');
    if (!layoutElement) return;

    const containerHeight = this.calculateContainerHeight();
    this.style.height = containerHeight + 'px';
  }

  private calculateContainerHeight(): number | undefined {
    const layoutElement = this.closest('mdw-layout');
    if (!layoutElement) return;

    const gap = this.options.gap;
    const cellH = this.options.cellHeight;
    let maxHeight = 0;

    this.data?.forEach((item) => {
      const cellHeight = item.height * cellH + (item.height - 1) * gap;
      const totalHeight = item.y * (cellH + gap) + cellHeight;
      if (totalHeight > maxHeight) {
        maxHeight = totalHeight;
      }
    });

    return maxHeight + gap;
  }

  private renderBoxes(): void {
    const layoutElement = this.closest('mdw-layout');
    if (!layoutElement) return;

    const containerRect = layoutElement.getBoundingClientRect();
    const containerWidth = containerRect.width;

    this.data?.forEach((item) => {
      const box = this.shadowRoot?.querySelector(`#widget-${item.id}`) as HTMLElement;
      if (box) {
        const style = this.calculateStyle(item, containerWidth);
        Object.assign(box.style, style);

        this.dispatchEvent(
          new CustomEvent(ChartEventType.BoxRenderComplete, {
            detail: { item },
            bubbles: true,
            composed: true,
          }),
        );
      }
    });
  }

  private calculateStyle(
    item: LayoutData,
    containerWidth: number,
  ): { width: string; height: string; transform: string } {
    const gap = this.options.gap;
    const cellH = this.options.cellHeight;
    const cols = this.options.cols;

    const gridWidth = containerWidth - gap * (cols + 1);
    const cellWidth = gridWidth / cols;

    const left = item.x * (cellWidth + gap) + 'px';
    const top = item.y * (cellH + gap) + 'px';
    const width = item.width * (cellWidth + gap) - gap + 'px';
    const height = item.height * (cellH + gap) - gap + 'px';

    const translateX = `translate3d(${left}, ${top}, 0)`;

    return { width, height, transform: translateX };
  }

  private handleBoxRendered(event: Event): void {
    const detail = (event as CustomEvent).detail;
    console.log('Box rendered:', detail);
  }
}
