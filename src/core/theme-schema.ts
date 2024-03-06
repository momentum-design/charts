/**
 * The keys of the built-in themes
 */

export enum ThemeSchemaKey {
  Lighten = 'lighten',
  Darken = 'darken',
}

export interface ThemeSchema {
  gridColor: string;
  legendSelectedBackgroundColor: string;
  textColorPrimary: string;
  textColorSecondary: string;
  textActiveColor: string;
  textInactiveColor: string;
  tooltipTextColor: string;
  tooltipBackgroundColor: string;
}

export const themeSchemas = new Map<string, ThemeSchema>([
  [
    'lighten',
    {
      gridColor: '#E5E6E6',
      legendSelectedBackgroundColor: '#2b2b2b1a',
      textColorPrimary: '#535759',
      textColorSecondary: '#7D7F7F',
      textActiveColor: 'black',
      textInactiveColor: '#7D7F7F',
      tooltipTextColor: '#efefef',
      tooltipBackgroundColor: '#000000e6',
    },
  ],
  [
    'darken',
    {
      gridColor: '#535759',
      legendSelectedBackgroundColor: '#F1EFEF1a',
      textColorPrimary: '#C5CBCD',
      textColorSecondary: '#7D7F7F',
      textActiveColor: '#FFFFFF',
      textInactiveColor: '#7D7F7F',
      tooltipTextColor: '#000000e6',
      tooltipBackgroundColor: '#efefef',
    },
  ],
]);

export const defaultThemeSchema = ThemeSchemaKey.Lighten;
