import { merge } from 'lodash-es';
import { ColorSetName, colorSets, defaultColorSet } from './colorsets';
import { defaultTheme, Theme, ThemeName, themes } from './themes';

/**
 * The global settings.
 */
export interface Settings {
  colorSet: ColorSetName | string;
  colorSets: Map<ColorSetName | string, string[]>;
  theme: ThemeName | string;
  themes: Map<ThemeName | string, Theme>;

  /**
   * Suffixed for big numbers. It's an array of objects of number/suffix pairs.
   * E.g. as per above 1500 will be converted to 1.5K.
   */
  bigNumberSuffixes: { number: number; suffix: string }[];

  /**
   * Changes the default settings with the partial object of {@link Settings}.
   *
   * @param partialSettings a partial object of {@link Settings} which will be merged into the default settings.
   * @returns the settings
   */
  set: (partialSettings: Partial<Settings>) => Settings;

  /**
   * Creates a new ColorSet and append to {@link Settings.colorSets | colorSets }.
   *
   * @param name the ColorSet name which is unique
   * @param colors an array of color for this ColorSet
   * @returns the settings
   */
  addColorSet: (name: string, colors: string[]) => Settings;

  /**
   * Creates a new theme and append to {@link Settings.themes | themes}.
   *
   * @param name the theme name which is unique
   * @param theme an theme Object related to colors
   * @returns the settings
   */
  addTheme: (name: string, theme: Theme) => Settings;
}

/**
 * The default settings, you can use `set({...})` method to change the global default settings.
 * And the parameter should be partial {@link Settings}.
 *
 * @example
 * The following code will show you how to add new theme and set it as global default colors for all charts.
 * ```ts
 * settings.addColorSet('new-colorset', ['#ff0000', '#00ff00']);
 * ```
 */
export const settings: Settings = {
  bigNumberSuffixes: [
    { number: 1e3, suffix: 'K' },
    { number: 1e6, suffix: 'M' },
    { number: 1e9, suffix: 'G' },
    { number: 1e12, suffix: 'T' },
    { number: 1e15, suffix: 'P' },
    { number: 1e18, suffix: 'E' },
    { number: 1e21, suffix: 'Z' },
    { number: 1e24, suffix: 'Y' },
  ],
  colorSet: defaultColorSet,
  colorSets: colorSets,
  theme: defaultTheme,
  themes: themes,

  set: function (partialSettings: Partial<Settings>): Settings {
    return merge(this, partialSettings);
  },

  addColorSet: function (name: string, colors: string[]): Settings {
    this.colorSets.set(name, colors);
    this.set({ colorSet: name as ColorSetName });
    return this;
  },

  addTheme: function (name: string, theme: Theme): Settings {
    this.themes.set(name, theme);
    this.set({ theme: name as ThemeName });
    return this;
  },
};
