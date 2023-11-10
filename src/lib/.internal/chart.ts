import { Chart as ChartJS } from 'chart.js/auto';
import { merge } from 'lodash-es';
import { settings, ThemeKey } from '../../core';
import { darkenColor, getRandomColor, lightenColor } from '../../helpers';
import { ChartContainer, ChartData, ChartOptions, ColorMode, TableData } from '../../types';

export abstract class Chart<TData extends ChartData, TOptions extends ChartOptions> {
  api?: ChartJS;

  private _colors?: string[];
  private _lastColor?: string;
  private _countColored = 0;
  private _options: TOptions;

  get options(): TOptions {
    return this._options;
  }

  constructor(protected data: TData, options?: TOptions) {
    this._options = merge(this.getDefaultOptions(), options);

    this.init();
  }

  init(): void {
    this.initColors();
  }

  render(container: ChartContainer): void {
    const config = this.getConfiguration();
    this.api = new ChartJS(container, config);
  }

  resize(): void {
    this.api?.resize();
  }

  update(): void {
    this.api?.update();
  }

  protected getColorsForKeys(keys: string[]): string[] {
    return keys.map((key) => this.getColorForKey(key, keys.length));
  }

  private getColorForKey(key: string, total: number): string {
    let color = '';
    if (this.options?.colorMapping) {
      color = this.options.colorMapping[key];
    }

    if (!color && this._colors && this._colors.length > this._countColored) {
      color = this._colors[this._countColored];
      this._countColored += 1;
    }

    if (!color && this._colors) {
      switch (this.options?.colorMode) {
        case ColorMode.Repeat:
          color = this._colors[this._countColored % this._colors?.length];
          this._countColored += 1;
          break;

        case ColorMode.Darken:
          color = darkenColor(this._lastColor!, 4 / total);
          break;

        case ColorMode.Lighten:
          color = lightenColor(this._lastColor!, 4 / total);
          break;

        case ColorMode.Random:
        default:
          color = getRandomColor();
          break;
      }
    }

    this._lastColor = color;

    return color;
  }

  private initColors(): void {
    if (this._colors) {
      return;
    }

    if (this.options?.colorSet) {
      this._colors = this.options.colorSet;
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

    this._colors = themeModel.colors || [];
    this._lastColor = this._colors[this._colors.length - 1];
  }

  abstract getTableData(): TableData;

  protected abstract getConfiguration(): any;
  protected abstract getDefaultOptions(): TOptions;
}
