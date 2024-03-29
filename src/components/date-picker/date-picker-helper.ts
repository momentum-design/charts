/* eslint-disable @typescript-eslint/no-explicit-any */
import { AmpPlugin, easepick, LockPlugin, PresetPlugin, RangePlugin, TimePlugin } from '@easepick/bundle';
import moment from 'moment';
import { formatDateWithTimezone, getDateDaysAgoWithTimezone, mergeObjects } from '../../helpers';
import { css_picker } from './date-picker-styles';
import { AmpOptions, DatePickerOptions, DatePickerPresetOptions, LockOptions } from './date-picker.types';

export class DatePickerHelper {
  static readonly defaults: DatePickerOptions = {
    grid: 2,
    calendars: 2,
    autoApply: false,
    range: false,
    time: false,
    amp: true,
    lang: 'en-US',
    readonly: true,
    format: 'MM/DD/YYYY',
  };

  static readonly pluginMaps: { [key: string]: any } = {
    range: RangePlugin,
    presetOptions: PresetPlugin,
    time: TimePlugin,
    amp: AmpPlugin,
  };

  private _options: DatePickerOptions;

  get options(): DatePickerOptions {
    return this._options;
  }

  constructor(options: DatePickerOptions) {
    this._options = this.getDefaultOptions(options);
  }

  public getDatePicker(el: HTMLElement): easepick.Core {
    return new easepick.create({
      element: el,
      css: css_picker.cssText,
      grid: this._options.grid,
      calendars: this._options.grid,
      autoApply: this._options.autoApply,
      lang: this._options.lang,
      readonly: this._options.readonly,
      format: this._options.format,
      plugins: [...this.getAllPluginOptions(), LockPlugin],
      RangePlugin: {
        delimiter: ' → ',
      },
      AmpPlugin: this.getAmpPluginOptions(),
      PresetPlugin: this.getPresetPluginOptions(),
      LockPlugin: this.getLockPluginOptions(),
      zIndex: 10,
      setup: (picker) => {
        picker.ui.container.dataset.theme = this._options.theme;
      },
    });
  }

  private getLockPluginOptions(): LockOptions {
    const options: LockOptions = {};

    if (this._options.minDate) {
      options.minDate = formatDateWithTimezone(this._options.minDate, this._options.timezone) as Date;
    }
    if (this._options.maxDate) {
      options.maxDate = formatDateWithTimezone(this._options.maxDate, this._options.timezone) as Date;
    }

    return options;
  }

  private getAmpPluginOptions(): AmpOptions {
    return this._options.amp
      ? {
          dropdown: {
            maxYear: this._options.maxDate ? this.getAmpPluginYear(this._options.maxDate) : undefined,
            minYear: this._options.minDate ? this.getAmpPluginYear(this._options.minDate) : 2010,
            months: true,
            years: true,
          },
        }
      : {};
  }

  private getPresetPluginOptions(): DatePickerPresetOptions {
    return this._options.presetOptions ? this.getPresetOptions() : {};
  }

  private getAllPluginOptions(): any[] {
    return (Object.keys(this._options) as Array<keyof DatePickerOptions>)
      .filter((key) => this._options[key] && DatePickerHelper.pluginMaps[key])
      .map((key) => DatePickerHelper.pluginMaps[key]);
  }

  private getDefaultOptions(options: DatePickerOptions): DatePickerOptions {
    const newOptions = mergeObjects(DatePickerHelper.defaults, options);
    if (!newOptions.range) {
      newOptions.grid = 1;
      newOptions.calendars = 1;
    }
    return newOptions;
  }

  private getPresetOptions(): DatePickerPresetOptions {
    const customPreset: { [key: string]: Date[] } = {};
    this._options.presetOptions?.data.forEach((option) => {
      if (option.value === 0 || option.value === -1) {
        option.value -= 1;
      }
      customPreset[option.label] = [
        getDateDaysAgoWithTimezone(option.value, this._options.timezone) as Date,
        getDateDaysAgoWithTimezone(option.value === -2 ? option.value : 0, this._options.timezone) as Date,
      ];
    });
    return {
      customPreset,
      position: this._options.presetOptions?.position ?? 'left',
    };
  }

  private getAmpPluginYear(date: string | Date | number): number {
    return moment(date).year();
  }
}
