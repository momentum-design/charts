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
  textActiveColor: string;
  textInactiveColor: string;
  tooltipTextColor: string;
  tooltipBackgroundColor: string;
}

export const themes = new Map<ThemeName | string, Theme>([
  [
    ThemeName.Light,
    {
      focusColor: '#3267C8',
      gridColor: '#E5E6E6',
      scrollbarBackgroundColor: '#f3f3f3',
      scrollbarThumbBackgroundColor: '#dddddd',
      legendSelectedBackgroundColor: '#2b2b2b1a',
      textColorPrimary: '#535759',
      textColorSecondary: '#7D7F7F',
      textActiveColor: 'black',
      textInactiveColor: '#7D7F7F',
      tooltipTextColor: '#EFEFEF',
      tooltipBackgroundColor: '#000000F2',
    },
  ],
  [
    ThemeName.Dark,
    {
      focusColor: '#3492eb',
      gridColor: '#535759',
      scrollbarBackgroundColor: 'transparent',
      scrollbarThumbBackgroundColor: '#ffffff33',
      legendSelectedBackgroundColor: '#F1EFEF1a',
      textColorPrimary: '#C5CBCD',
      textColorSecondary: '#7D7F7F',
      textActiveColor: '#FFFFFF',
      textInactiveColor: '#7D7F7F',
      tooltipTextColor: '#000000e6',
      tooltipBackgroundColor: '#EFEFEFF2',
    },
  ],
]);

export const defaultTheme = ThemeName.Light;

export function getThemeByName(name: string | undefined): Theme | undefined {
  return name ? themes.get(name) : undefined;
}
