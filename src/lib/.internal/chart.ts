import { Chart as CJ, ChartConfiguration as CJConfiguration, ChartOptions as CJOptions, FontSpec } from 'chart.js/auto';
import { formatBigNumber as fbn, settings, ThemeKey } from '../../core';
import { darkenColor, formatNumber, getRandomColor, lightenColor, mergeObjects } from '../../helpers';
import { ChartContainer, ChartData, ChartOptions, ColorMode, Font, TableData } from '../../types';
import { Legend } from '../legend';
import { SegmentClickable } from '../plugins/segment-click';
import { CategoryLabelSelectable } from '../xy/xy.category-label-selectable';

export abstract class Chart<TData extends ChartData, TOptions extends ChartOptions> {
  static defaults: ChartOptions = {
    font: {
      size: 13,
      family: 'CiscoSansTT Regular,Helvetica Neue,Helvetica,Arial,sans-serif',
      style: 'normal',
      color: '#121212',
      weight: undefined,
      lineHeight: 1.2,
    },
    mutedColor: '#535759',
    valuePrecision: 2,
  };

  api?: CJ;
  canvasElement?: HTMLCanvasElement;
  rootElement?: HTMLElement;
  legend?: Legend<typeof this>;
  segmentClick?: SegmentClickable<typeof this>;

  private colors?: string[];
  private lastColor?: string;
  private countColored = 0;
  private _options: TOptions;

  get options(): TOptions {
    return this._options;
  }

  constructor(protected data: TData, options?: TOptions) {
    this._options = mergeObjects({}, Chart.defaults, this.getDefaultOptions(), options);

    this.init();
  }

  init(): void {
    CJ.defaults.font = this.getCJFont();

    this.initColors();
  }

  render(container: ChartContainer): void {
    let config = this.getConfiguration();
    this.api = new CJ(container, {
      type: config.type,
      plugins: config.plugins,
    } as CJConfiguration);
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
    this.api?.destroy();
  }

  protected enableLegend(): void {
    this.legend = new Legend(this);
  }

  protected enableSegmentClick(): void {
    this.segmentClick = new SegmentClickable(this);
  }

  protected getColorsForKeys(keys: string[]): string[] {
    return keys.map((key) => this.getColorForKey(key, keys.length));
  }

  protected getCJFont(...fonts: Font[]): Partial<FontSpec> {
    if (Chart.defaults.font) {
      fonts.push(Chart.defaults.font);
    }
    fonts.reverse();
    return mergeObjects({}, ...fonts);
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

    let themeModel = {
      name: settings.theme,
      colors: settings.themes.get(settings.theme),
    };
    if (this.options?.theme) {
      if (!settings.themes.has(this.options.theme)) {
        throw new Error(
          `There is no definition for theme ${this.options.theme}, we will use the default theme instead.`,
        );
      } else {
        themeModel = {
          name: this.options.theme as ThemeKey,
          colors: settings.themes.get(this.options.theme),
        };
      }
    }

    this.colors = themeModel.colors || [];
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
}

export type TypedChart = typeof Chart<ChartData, ChartOptions>;
