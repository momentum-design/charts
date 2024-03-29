import { easepick } from '@easepick/bundle';
import { css, CSSResult, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { COMPONENT_PREFIX } from '../../core';
import { formatDateWithTimezone } from '../../helpers';
import { DatePickerHelper } from './date-picker-helper';
import { DatePickerEventType, DatePickerOptions } from './date-picker.types';

const tag = `${COMPONENT_PREFIX}-datepicker`;

@customElement(tag)
export class DatePickerComponent extends LitElement {
  static get styles(): CSSResult {
    return css`
      .mdw-datepicker {
        padding: 0.1rem 0.25rem;
        border: 1px solid #000;
        border-radius: 0.5rem;
        width: 100%;
        display: flex;
        align-items: center;
      }
      .mdw-datepicker:hover,
      .datepicker:focus {
        background-color: rgba(0, 0, 0, 0.12);
        box-shadow: 0 0 0 0.25rem rgba(17, 112, 207, 0.3), 0 0 0 2px #1170cf;
      }
      .mdw-datepicker .calendar-icon {
        margin-left: 0.2rem;
        margin-right: 0.6rem;
      }
      .mdw-datepicker input {
        background-color: transparent;
        border: 0;
        outline: 0;
        width: 100%;
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.9);
      }
    `;
  }

  @property({ type: Object, hasChanged: () => true })
  options?: DatePickerOptions;

  @property({ type: String })
  private defaultValue: string;

  private datePicker: easepick.Core | undefined;

  constructor() {
    super();
    this.defaultValue = '';
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setStartAndEndDate();
  }

  updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('defaultValue') || changedProperties.has('options')) {
      this.setStartAndEndDate();
      if (this.datePicker) {
        this.datePicker.destroy();
      }
      this.datePicker = new DatePickerHelper(this.options || {}).getDatePicker(
        this.shadowRoot?.querySelector('.my-datepicker') as HTMLElement,
      );
      this.datePicker.on('select', (date) => {
        this.dispatchEvent(
          new CustomEvent(DatePickerEventType.DateRangeChange, {
            detail: date.detail,
            bubbles: true,
            composed: true,
          }),
        );
      });
    }
  }

  render() {
    return html`<div class="mdw-datepicker">
      <div class="calendar-icon">
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <title>meetings/calendar-month_16</title>
          <path
            d="M14 2c1.104 0 2 .895 2 2l0 10c0 1.105-.896 2-2 2L2 16c-1.104 0-2-.895-2-2L0 4c0-1.105.896-2 2-2l2 0L4 .5c0-.275.225-.5.5-.5.275 0 .5.225.5.5L5 2l6 0 0-1.5c0-.275.225-.5.5-.5.275 0 .5.225.5.5L12 2l2 0zm1 12l0-10c0-.551-.448-1-1-1L2 3c-.552 0-1 .449-1 1l0 10c0 .551.448 1 1 1l12 0c.552 0 1-.449 1-1zM8 9.5c-.27614237 0-.5-.22385763-.5-.5 0-.27614237.22385763-.5.5-.5.27614237 0 .5.22385763.5.5 0 .27614237-.22385763.5-.5.5zm-3.5 0c-.27614237 0-.5-.22385763-.5-.5 0-.27614237.22385763-.5.5-.5.27614237 0 .5.22385763.5.5 0 .27614237-.22385763.5-.5.5zm7 0c-.2761424 0-.5-.22385763-.5-.5 0-.27614237.2238576-.5.5-.5.2761424 0 .5.22385763.5.5 0 .27614237-.2238576.5-.5.5zM8 7c-.27614237 0-.5-.22385763-.5-.5 0-.27614237.22385763-.5.5-.5.27614237 0 .5.22385763.5.5 0 .27614237-.22385763.5-.5.5zM4.5 7c-.27614237 0-.5-.22385763-.5-.5 0-.27614237.22385763-.5.5-.5.27614237 0 .5.22385763.5.5 0 .27614237-.22385763.5-.5.5zm7 0c-.2761424 0-.5-.22385763-.5-.5 0-.27614237.2238576-.5.5-.5.2761424 0 .5.22385763.5.5 0 .27614237-.2238576.5-.5.5zM8 12c-.27614237 0-.5-.2238576-.5-.5 0-.2761424.22385763-.5.5-.5.27614237 0 .5.2238576.5.5 0 .2761424-.22385763.5-.5.5zm-3.5 0c-.27614237 0-.5-.2238576-.5-.5 0-.2761424.22385763-.5.5-.5.27614237 0 .5.2238576.5.5 0 .2761424-.22385763.5-.5.5zm7 0c-.2761424 0-.5-.2238576-.5-.5 0-.2761424.2238576-.5.5-.5.2761424 0 .5.2238576.5.5 0 .2761424-.2238576.5-.5.5z"
            fill="#000"
            fill-rule="evenodd"
          />
        </svg>
      </div>
      <input type="text" class="my-datepicker" tabindex="-1" .value="${this.defaultValue}" />
    </div>`;
  }

  private setStartAndEndDate(): void {
    const datePickerOptions = {
      ...DatePickerHelper.defaults,
      ...this.options,
    } as DatePickerOptions;

    const startDate = datePickerOptions.startDate
      ? formatDateWithTimezone(datePickerOptions.startDate, datePickerOptions.timezone, datePickerOptions.format)
      : '';
    const endDate = datePickerOptions.endDate
      ? formatDateWithTimezone(datePickerOptions.endDate, datePickerOptions.timezone, datePickerOptions.format)
      : '';
    if (datePickerOptions.range) {
      if (startDate || endDate) {
        this.defaultValue = `${startDate} → ${endDate}`;
      }
    } else {
      this.defaultValue = `${startDate}`;
    }
  }
}
