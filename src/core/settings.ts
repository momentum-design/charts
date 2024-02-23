import { merge } from 'lodash-es';
import { defaultTheme, ThemeKey, themes } from './theme';
import { defaultThemeSchema, ThemeSchema, ThemeSchemaKey, themeSchemas } from './theme-schema';

/**
 * The global settings.
 */
export interface Settings {
  theme: ThemeKey;
  themes: Map<ThemeKey | string, string[]>;
  themeSchema: ThemeSchemaKey;
  themeSchemas: Map<ThemeSchemaKey | string, ThemeSchema>;

  /**
   * Suffixed for big numbers. It's an array of objects of number/suffix pairs.
   * E.g. as per above 1500 will be converted to 1.5K.
   */
  bigNumberSuffixes: { number: number; suffix: string }[];

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

  /**
   * Creates a new theme schema and append to {@link Settings.themes | themes}.
   *
   * @param themeSchemaKey the theme schema key which is unique
   * @param themeSchema an Object about theme settings of this theme schema
   * @returns the default settings
   */
  addThemeSchema: (themeKey: string, themeSchema: ThemeSchema) => Settings;
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
  theme: defaultTheme,
  themes,
  themeSchema: defaultThemeSchema,
  themeSchemas: themeSchemas,

  set: function (partialSettings: Partial<Settings>): Settings {
    return merge(this, partialSettings);
  },

  addTheme: function (themeKey: string, colors: string[]): Settings {
    this.themes.set(themeKey, colors);
    this.set({ theme: themeKey as ThemeKey });
    return this;
  },

  addThemeSchema: function (themeSchemaKey: string, themeSchema: ThemeSchema): Settings {
    this.themeSchemas.set(themeSchemaKey, themeSchema);
    this.set({ themeSchema: themeSchemaKey as ThemeSchemaKey });
    return this;
  },
};
