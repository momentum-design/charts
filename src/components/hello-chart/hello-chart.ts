import { Chart } from 'chart.js/auto';
import { css, html, LitElement, PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ChartA11y, ChartLegendA11y } from '../../core/plugins';

@customElement('wc-hello-chart')
export class HelloChart extends LitElement {
  public static styles = css`
    :host {
      display: block;
    }
  `;

  protected render() {
    return html`<canvas></canvas>`;
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    console.log(this.children);
    const chart = new Chart(this.renderRoot.querySelector('canvas') as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
      plugins: [ChartA11y, ChartLegendA11y],
    });
  }
}
