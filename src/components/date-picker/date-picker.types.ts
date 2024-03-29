export interface DatePickerOptions {
  /**
   * Hide the apply and cancel buttons, and automatically apply a new date range as soon as two dates are clicked.
   */
  autoApply?: boolean;
  /**
   * Date Object or Unix Timestamp (with milliseconds) or String (must be equal to option format).
   */
  startDate?: string | Date | number;
  /**
   * Date Object or Unix Timestamp (with milliseconds) or String (must be equal to option format).
   */
  endDate?: string | Date | number;
  /**
   * The minimum/earliest date that can be selected. Date Object or Unix Timestamp (with milliseconds) or ISO String.
   * When a date is provided as a string, it must be equal to the format option.
   */
  minDate?: string | Date | number;
  /**
   * The maximum/latest date that can be selected. Date Object or Unix Timestamp (with milliseconds) or ISO String.
   * When a date is provided as a string, it must be equal to the format option.
   */
  maxDate?: string | Date | number;
  /**
   * The default output format. MM/DD/YYYY
   */
  format?: string;
  /**
   * Number of columns months.
   */
  grid?: number;
  /**
   * Number of visible months.
   */
  calendars?: number;
  /**
   * Provides the ability to select a date range.
   */
  range?: boolean;
  /**
   * Provides the ability to preset.
   */
  presetOptions?: PresetOptions;
  /**
   * Adds time picker.
   */
  time?: boolean;
  /**
   * Adds extra options.(years and months supported select)
   */
  amp?: boolean;
  /**
   * Add readonly attribute to element.
   */
  readonly?: boolean;
  /**
   * This option affect to day names, month names and also affect to plural rules via.
   */
  lang?: string;
  /**
   * Define your own timezone.
   */
  timezone?: string;
  /**
   * Define your own theme.
   */
  theme?: string;
}

export interface PresetOptions {
  /**
   * Preset data.
   */
  data: PresetData[];
  /**
   * Preset position.
   */
  position?: 'left' | 'right';
}

export interface PresetData {
  /**
   * Preset name.
   */
  label: string;
  /**
   * Preset date difference.
   */
  value: number;
}

export interface DatePickerPresetOptions {
  /**
   * Define your own ranges.
   */
  customPreset?: Record<string, Date[]>;
  /**
   * Position of preset block.
   */
  position?: 'left' | 'right';
}

export interface LockOptions {
  /**
   * The minimum/earliest date that can be selected. Date Object or Unix Timestamp (with milliseconds) or ISO String.
   * When a date is provided as a string, it must be equal to the format option.
   */
  minDate?: Date;
  /**
   * The maximum/latest date that can be selected. Date Object or Unix Timestamp (with milliseconds) or ISO String.
   * When a date is provided as a string, it must be equal to the format option.
   */
  maxDate?: Date;
}

export interface AmpOptions {
  /**
   *  Enable dropdowns for months, years.
   */
  dropdown?: DropdownOptions;
}

export interface DropdownOptions {
  /**
   * The maximum year. If maxYear is null then maxYear will be equal to (new Date()).getFullYear().
   */
  maxYear?: number;
  /**
   * The minimum year.
   */
  minYear?: number;
  /**
   * Enable the months
   */
  months?: boolean;
  /**
   * years can be equal to asc string to change the sort direction.
   */
  years?: boolean;
}

export enum DatePickerEventType {
  DateRangeChange = 'dateRangeChange',
}
