import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { COMPONENT_PREFIX, settings } from '../../core';

/**
 * @ignore
 */
@customElement(`${COMPONENT_PREFIX}-colorsets`)
export class ColorSets extends LitElement {
  static styles = css`
    :host {
      display: table;
      width: 100%;
      border-collapse: collapse;
    }
    .item {
      display: table-row;
    }
    .item.current .item-name {
      font-weight: bold;
    }
    .item .item-name {
      width: 160px;
      display: table-cell;
      vertical-align: middle;
      padding: 1rem;
      border: solid 1px #efefef;
      text-align: center;
    }
    .item .item-values {
      display: table-cell;
      padding: 1rem 0;
      border: solid 1px #efefef;
    }
    .color-item {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      width: 5rem;
      text-align: center;
      padding: 0.25rem 0.5rem;
    }
    .color-item .text {
      display: block;
    }
    .color-item .flag {
      display: block;
      border-radius: 4px;
      width: 4.2rem;
      height: 1rem;
    }
  `;

  render() {
    return html`${Array.from(settings.colorSets.keys()).map(
      (key) =>
        html`<div class="item ${classMap(this.getClasses(key))}">
          <div class="item-name">${key}</div>
          <div class="item-values">${this.getColorItem(settings.colorSets.get(key) || [])}</div>
        </div>`,
    )} `;
  }

  getClasses(name: string): { current?: boolean } {
    if (settings.colorSet === name) {
      return { current: true };
    }
    return {};
  }

  getColorItem(colors: string[]) {
    return html`${colors.map(
      (color) =>
        html`<div class="color-item">
          <span class="text">${color}</span><span class="flag" style="background-color: ${color}"></span>
        </div>`,
    )}`;
  }
}
