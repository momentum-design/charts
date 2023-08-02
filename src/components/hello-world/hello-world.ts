import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @ignore
 */
@customElement('wc-hello-world')
export class HelloWorld extends LitElement {
  static styles = css`
    p {
      color: blue;
      border: solid 1px #efefef;
      padding: 0.5rem;
    }
  `;

  @property()
  name = 'Somebody';

  render() {
    return html`<p>Hello, ${this.name}! This is a web component.</p>`;
  }
}
