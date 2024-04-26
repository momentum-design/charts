/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { COMPONENT_PREFIX, settings, Theme } from '../../core';

const tag = `${COMPONENT_PREFIX}-themes`;
/**
 * @ignore
 */
@customElement(tag)
export class Themes extends LitElement {
  render() {
    return html`<table>
      <thead>
        <tr>
          <th>Key</th>
          <th class="w-48">Swatch</th>
          <th style="text-align: left;">Property</th>
        </tr>
      </thead>
      ${Array.from(settings.themes.keys()).map((themeKey) =>
        this.renderContent(themeKey, settings.themes.get(themeKey)),
      )}
    </table>`;
  }

  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  private renderContent(key: string, theme?: Theme) {
    return html`<tbody>
      ${Object.keys(theme ?? {}).map(
        (k, idx) =>
          html`<tr>
            ${idx === 0
              ? html`<th rowspan="${Object.keys(theme ?? {}).length}">${key === settings.theme ? '👉' : ''} ${key}</th>`
              : ``}
            <td class="${key}-bg text-center">
              <div
                class="inline-block border-dotted border-2 border-gray-100 rounded w-32 h-8"
                style="background-color: ${(theme as any)[k]}"
              ></div>
            </td>
            <td>${k}</td>
          </tr>`,
      )}
    </tbody>`;
  }
}
