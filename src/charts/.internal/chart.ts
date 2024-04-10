import { Chart as CJ, ChartOptions as CJOptions, Color, FontSpec } from 'chart.js/auto';
import { ColorSetName, formatBigNumber as fbn, getThemeByName, settings, Theme, ThemeName, themes } from '../../core';
import { darkenColor, formatNumber, getRandomColor, lightenColor, mergeObjects } from '../../helpers';
import { ChartContainer, ChartData, ChartOptions, ColorMode, Font, TableData } from '../../types';
import { SegmentClickable } from '../.plugins/segment-clickable';
import { Legend } from '../legend';
import { CategoryLabelSelectable } from '../xy/xy.category-label-selectable';

export abstract class Chart<TData extends ChartData, TOptions extends ChartOptions> {
  static defaults: ChartOptions = {
    font: {
      size: 13,
      family: 'CiscoSansTT Regular,Helvetica Neue,Helvetica,Arial,sans-serif',
      style: 'normal',
      weight: undefined,
      lineHeight: 1.2,
    },
    valuePrecision: 2,
  };

  api?: CJ;
  canvasElement?: HTMLCanvasElement;
  rootElement?: HTMLElement;
  legend?: Legend<typeof this>;
  segmentClickable?: SegmentClickable<typeof this>;

  private currentTheme?: string;
  private colors?: string[];
  private lastColor?: string;
  private countColored = 0;

  private _options: TOptions;
  private _theme?: Theme;

  get options(): TOptions {
    return this._options;
  }

  constructor(private container: ChartContainer, protected data: TData, options?: TOptions) {
    this._options = mergeObjects({}, Chart.defaults, this.getDefaultOptions(), options);
  }

  render(): void {
    this.destroy();
    this.init();

    const config = this.getConfiguration();
    // TODO(zupan) config needs to be split, and be aware of accessibility
    this.api = new CJ(this.container, config);
    this.canvasElement = this.api.canvas;
    this.rootElement = this.canvasElement.parentElement || this.api.canvas;
    if (this.calculateMaxLimitTicks) {
      this.calculateMaxLimitTicks(config.options);
    }
    this.api.data = config.data;
    this.api.options = config.options;
    this.api.update();
  }

  resize(): void {
    this.api?.resize();
    this.legend?.resetSelectedLegendItems();
  }

  update(): void {
    this.api?.update();
  }

  destroy(): void {
    this.colors = undefined;
    this.lastColor = undefined;
    this.countColored = 0;
    this.api?.destroy();
  }

  changeTheme(name: string) {
    this.setTheme(name);
  }

  getCurrentTheme(): Theme {
    this._theme = getThemeByName(this.currentTheme);
    if (!this._theme) {
      console.warn(`No theme found for name "${this.currentTheme}". Will use light theme instead.`);
      this._theme = themes.get(ThemeName.Light)!;
    }
    return this._theme;
  }

  protected enableLegend(): void {
    this.legend = new Legend(this);
  }

  protected enableSegmentClickable(): void {
    this.segmentClickable = new SegmentClickable(this);
  }

  protected getColorsForKeys(keys: string[]): string[] {
    return keys.map((key) => this.getColorForKey(key, keys.length));
  }

  protected getCJFont(...fonts: Font[]): Partial<FontSpec> {
    if (this.options.font) {
      fonts.push(this.options.font);
    }
    fonts.reverse();
    return mergeObjects(...(fonts as [FontSpec]));
  }

  protected formatBigNumber(value: number): string {
    return fbn(value, this.options.valuePrecision);
  }

  protected formatValueWithUnit(value: number, unit?: string): string {
    const u = unit || this.options.valueUnit;
    return `${this.formatValue(value)}${u ? ' ' + u : ''}`;
  }

  protected getValueWithUnit(value: number, unit?: string): string {
    let formatted = new Intl.NumberFormat().format(value || 0);
    if (unit) {
      formatted += ' ' + this.options.valueUnit;
    }
    return formatted;
  }

  private init(): void {
    this.initTheme();
    this.initColors();

    CJ.defaults.font = this.getCJFont();
    CJ.defaults.color = this.options.font?.color
      ? this.options.font?.color
      : (this.getCurrentTheme().textColorPrimary as Color);
  }

  private initTheme(): void {
    this.setTheme(this.options.theme ?? settings.theme);
  }

  private setTheme(name: string): void {
    const needToRender = this.currentTheme && this.currentTheme !== name;
    this.currentTheme = name;

    if (needToRender) {
      this.onThemeChanging();
      if (this.api) {
        this.render();
      }
    }
  }

  private getColorForKey(key: string, total: number): string {
    let color = '';
    if (this.options?.colorMapping) {
      color = this.options.colorMapping[key];
    }

    if (!color && this.colors && this.colors.length > this.countColored) {
      color = this.colors[this.countColored];
      this.countColored += 1;
    }

    if (!color && this.colors) {
      switch (this.options?.colorMode) {
        case ColorMode.Repeat:
          color = this.colors[this.countColored % this.colors?.length];
          this.countColored += 1;
          break;

        case ColorMode.Darken:
          color = darkenColor(this.lastColor!, 4 / total);
          break;

        case ColorMode.Lighten:
          color = lightenColor(this.lastColor!, 4 / total);
          break;

        case ColorMode.Random:
        default:
          color = getRandomColor();
          break;
      }
    }

    this.lastColor = color;

    return color;
  }

  private initColors(): void {
    if (this.colors) {
      return;
    }

    if (this.options?.colors) {
      this.colors = this.options.colors;
      return;
    }

    let colorSet = {
      name: settings.colorSet,
      colors: settings.colorSets.get(settings.colorSet),
    };
    if (this.options?.colorSet) {
      if (!settings.colorSets.has(this.options.colorSet)) {
        throw new Error(
          `There is no definition for colorset "${this.options.colorSet}", we will use the default colorset instead.`,
        );
      } else {
        colorSet = {
          name: this.options.colorSet as ColorSetName,
          colors: settings.colorSets.get(this.options.colorSet),
        };
      }
    }

    this.colors = colorSet.colors || [];
    this.lastColor = this.colors[this.colors.length - 1];
  }

  private formatValue(value: number): string {
    return formatNumber(value, this.options.valuePrecision || 0);
  }

  abstract getTableData(): TableData;

  protected abstract getConfiguration(): any;
  protected abstract getDefaultOptions(): TOptions;

  onWheel?(event: WheelEvent): void;
  getCategoryLabelSelectable?(): CategoryLabelSelectable<typeof this>;
  calculateMaxLimitTicks?(options: CJOptions): void;

  protected onThemeChanging(): void {}
}

export type TypedChart = typeof Chart<ChartData, ChartOptions>;
