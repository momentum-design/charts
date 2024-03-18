import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { map } from 'lit/directives/map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { COMPONENT_PREFIX } from '../../core';
import '../../styles/main.scss';
import { panelStyles } from './panel.styles';
import { Action, Button, PanelData, PanelEventType, PanelOptions, RadioButtonGroup } from './panel.types';
/**
 * The chart component for rendering all charts that extends {@link LitElement}.
 *
 * @category Components
 *
 * @example
 * ```html
 * <mdw-panel
 *   data=''
 *   options=''
 * ></mdw-panel>
 * ```
 *
 * @typeParam TData - the type of panel data
 * @typeParam TOptions - the type of panel options
 */
@customElement(`${COMPONENT_PREFIX}-panel`)
export class PanelComponent<TData extends PanelData, TOptions extends PanelOptions> extends LitElement {
  static disableShadowRoot = true;
  static styles = [
    // unsafeCSS(mainStyles),
    panelStyles,
    css``,
  ];

  private theme?: string;
  private tag = 'panel';

  /**
   * The data for current panel.
   */
  @property({ type: Object, hasChanged: () => true })
  data?: TData;

  /**
   * The options for current panel.
   */
  @property({ type: Object, hasChanged: () => true })
  options?: TOptions;

  private onThemeChange = (event: CustomEvent<string>) => {
    if (event.detail) {
      this.theme = event.detail;
      this.render();
    }
  };

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener(PanelEventType.ThemeChange, this.onThemeChange as EventListener);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener(PanelEventType.ThemeChange, this.onThemeChange as EventListener);
  }

  render(): TemplateResult {
    const classes: { [name: string]: boolean } = { [this.tag]: true };
    if (this.theme) {
      classes[this.theme] = true;
    }
    return html`<div class="${classMap(classes)}">${this.renderHeader()} ${this.renderBody()}</div>`;
  }

  private renderHeader(): TemplateResult {
    return html`<div class="${this.tag}-header">
      <div class="base-info ${this.options?.descriptionMode}">
        <span tabindex="0" role="heading" class="title">${this.data?.title}<i class="fa fa-adn"></i></span>
        ${this.renderDescription()}
      </div>
      <div class="actions">${this.renderActions()}</div>
    </div>`;
  }

  private renderDescription(): TemplateResult {
    if (this.options?.descriptionMode === 'subtitle') {
      return html`<span tabindex="0" role="note" class="description-subtitle">
        ${unsafeHTML(this.data?.description)}
      </span>`;
    }
    return html`<i tabindex="0" role="note" class="description-icon" title="${this.data?.description ?? ''}"></i>`;
  }

  private renderActions(): TemplateResult {
    if (!this.options?.actions?.items || this.options?.actions.items.length === 0) {
      return html``;
    }
    return html`
      <div class="actions-more">
        <i
          tabindex="${ifDefined(this.options?.actions?.tabindex)}"
          role="${ifDefined(this.options?.actions?.role)}"
          aria-label="${ifDefined(this.options?.actions?.ariaLabel)}"
        ></i>
        <span>${ifDefined(this.options?.actions?.label)}</span>
        <ul class="actions-more-list" id="actionsList">
          ${map(
            this.options.actions.items,
            (action: Action, index: number) => html`<li>
              <button
                tabindex="${ifDefined(action.tabindex)}"
                role="${ifDefined(action.role)}"
                aria-label="${ifDefined(action.ariaLabel)}"
                class="${this.tag}-action"
                @click=${() => this.onActionClick(action, index)}
              >
                ${action.label}
              </button>
            </li>`,
          )}
        </ul>
      </div>
    `;
  }

  private renderBody(): TemplateResult {
    return html`<div class="${this.tag}-body">${this.renderButtonGroups()} ${this.renderSlot()}</div>`;
  }

  private renderButtonGroups(): TemplateResult {
    if (!this.options?.radioButtonGroups || this.options?.radioButtonGroups.length === 0) {
      return html``;
    }
    return html`<div class="button-groups">
      ${map(
        this.options.radioButtonGroups,
        (buttonGroup: RadioButtonGroup) =>
          html`<div
            tabindex="${ifDefined(buttonGroup.tabindex)}"
            role="${ifDefined(buttonGroup.role)}"
            aria-label="${ifDefined(buttonGroup.ariaLabel)}"
            class="button-group"
          >
            ${map(
              buttonGroup.buttons ?? [],
              (button: Button, index: number) =>
                html`<button
                  tabindex="${ifDefined(button.tabindex)}"
                  role="${ifDefined(button.role)}"
                  aria-label="${ifDefined(button.ariaLabel)}"
                  class="button${button.active ? ' active' : ''}"
                  @click=${() => this.onButtonClick(button, index, buttonGroup)}
                >
                  ${button.label}
                </button>`,
            )}
          </div>`,
      )}
    </div>`;
  }

  private renderSlot(): TemplateResult {
    return html`<slot></slot>`;
  }

  protected firstUpdated(): void {}

  updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('data') || changedProperties.has('options')) {
      this.render();
    }
  }

  private onButtonClick(button: Button, index: number, buttonGroup: RadioButtonGroup): void {
    this.dispatchEvent(
      new CustomEvent(PanelEventType.ButtonGroupClick, {
        detail: {
          index,
          button: button,
        },
      }),
    );
    if (button.onClick) {
      button.onClick(button, index);
    } else if (buttonGroup.onClick) {
      buttonGroup.onClick(button, index);
    }
    this.options?.radioButtonGroups?.map((group: RadioButtonGroup) => {
      if (group.type === buttonGroup.type) {
        group.buttons?.map((item: Button) => {
          item.active = item.value === button.value;
        });
      }
    });
    this.requestUpdate();
  }

  private onActionClick(action: Action, index: number): void {
    this.dispatchEvent(
      new CustomEvent(PanelEventType.ActionClick, {
        detail: {
          index,
          action: action,
        },
      }),
    );
    if (action.onClick) {
      action.onClick(action, index);
    }
  }
}
