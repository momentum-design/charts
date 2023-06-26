import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wc-hello-world')
export class HelloWorld extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  @property()
  name = 'Somebody';

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
