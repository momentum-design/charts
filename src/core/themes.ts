export enum ThemeName {
  Light = 'light',
  Dark = 'dark',
}

export interface Theme {
  focusColor: string;
  gridColor: string;
  scrollbarBackgroundColor: string;
  scrollbarThumbBackgroundColor: string;
  legendSelectedBackgroundColor: string;
  textColorPrimary: string;
  textColorSecondary: string;

  activeTextColor: string;
  activeBackgroundColor: string;

  inactiveTextColor: string;
  inactiveBackgroundColor: string;

  tooltipTextColor: string;
  tooltipBackgroundColor: string;
}

export const themes = new Map<ThemeName | string, Theme>([
  [
    ThemeName.Light,
    {
      focusColor: '#3267c8',
      gridColor: '#e5e5e5',
      scrollbarBackgroundColor: '#f3f3f3',
      scrollbarThumbBackgroundColor: '#dddddd',
      legendSelectedBackgroundColor: '#2b2b2b1a',
      textColorPrimary: '#535759',
      textColorSecondary: '#7d7d7d',

      activeTextColor: '#000000',
      activeBackgroundColor: '#7D7F7F',

      inactiveTextColor: '#9d9d9d',
      inactiveBackgroundColor: '#e9ecef',

      tooltipTextColor: '#efefef',
      tooltipBackgroundColor: '#000000f2',
    },
  ],
  [
    ThemeName.Dark,
    {
      focusColor: '#3492eb',
      gridColor: '#535353',
      scrollbarBackgroundColor: 'transparent',
      scrollbarThumbBackgroundColor: '#ffffff33',
      legendSelectedBackgroundColor: '#f1efef1a',
      textColorPrimary: '#c5cbcd',
      textColorSecondary: '#7d7f7f',

      activeTextColor: '#ffffff',
      activeBackgroundColor: '',

      inactiveTextColor: '#8b8b8b',
      inactiveBackgroundColor: '#343a40',

      tooltipTextColor: '#000000e6',
      tooltipBackgroundColor: '#efefeff2',
    },
  ],
]);

export const defaultTheme = ThemeName.Light;

export function getThemeByName(name: string | undefined): Theme | undefined {
  return name ? themes.get(name) : undefined;
}
