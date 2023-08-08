import { merge } from 'lodash-es';
import { defaultTheme, ThemeKey, themes } from './theme';

/**
 * The global settings.
 */
export interface Settings {
  theme: ThemeKey;
  themes: Map<ThemeKey | string, string[]>;

  /**
   * Changes the default settings with the partial object of {@link Settings}.
   *
   * @param partialSettings a partial object of {@link Settings} which will be merged into the default settings.
   * @returns the default settings
   */
  set: (partialSettings: Partial<Settings>) => Settings;

  /**
   * Creates a new theme and append to {@link Settings.themes | themes}.
   *
   * @param themeKey the theme key which is unique
   * @param colors an array of color for this theme
   * @returns the default settings
   */
  addTheme: (themeKey: string, colors: string[]) => Settings;
}

/**
 * The default settings, you can use `set({...})` method to change the global default settings.
 * And the parameter should be partial {@link Settings}.
 *
 * @example
 * The following code will show you how to add new theme and set it as global default theme.
 * ```ts
 * settings.addTheme('new-theme', ['#ff0000', '#00ff00']).set({theme: 'new-theme'});
 * ```
 */
export const settings: Settings = {
  theme: defaultTheme,
  themes,

  set: function (partialSettings: Partial<Settings>): Settings {
    return merge(this, partialSettings);
  },

  addTheme: function (themeKey: string, colors: string[]): Settings {
    this.themes.set(themeKey, colors);
    return this;
  },
};
