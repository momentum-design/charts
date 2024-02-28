import { FontSpec } from 'chart.js/auto';
import * as helper from '../helpers';
import { settings } from './settings';

/**
 * Gets the current theme object.
 *
 * @returns The current theme object
 */
export function getCurrentTheme(): { name: string; colors: string[] | undefined } {
  return {
    name: settings.theme,
    colors: settings.themes.get(settings.theme),
  };
}

/**
 * Gets colors by the specified theme.
 *
 * @param theme The theme key
 * @returns An array which includes all colors in this theme or undefined.
 */
export function getColorsByTheme(theme: string): string[] | undefined {
  return settings.themes.get(theme);
}

/**
 * Gets color by specified index number in the theme.
 *
 * @param theme The theme key.
 * @param index The index of color.
 * @returns A color if matched, otherwise an empty string.
 */
export function getColor(theme: string, index: number): string {
  const colors = getColorsByTheme(theme);
  if (colors && index < colors?.length) {
    return colors[index];
  }
  return '';
}

/**
 * Gets color of specified index from an array of color or theme.
 * First get from the specified colors. If not matched, then from the theme.
 *
 * @param index The index in the array of color.
 * @param colors The array of color. It is optional.
 * @param chartTheme The theme which should be defined or under built-in themes.
 * @returns The color string or empty string if not matched.
 */
export function getColorForChart(index: number, colors?: string[], chartTheme?: string): string {
  if (colors && colors.length > index) {
    return colors[index];
  }

  if (chartTheme) {
    const themeColors = getColorsByTheme(chartTheme);
    if (themeColors && themeColors.length > index) {
      return themeColors[index];
    }
  }

  return '';
}

/**
 * By FontSpec object, get the font abbreviation style.
 *
 * @param fontSpec FontSpec object
 * @returns Abbreviation Style: [font-weight][font-size][font-family]
 */
export function getFontStyleAbbreviation(fontSpec: Partial<FontSpec>): string {
  return `${fontSpec.weight ?? ''} ${fontSpec.size}px ${fontSpec.family ?? ''}`;
}

/**
 * Formats the big number with specified suffix({@link settings.bigNumberSuffixes})
 * @param value The number
 * @param precision The number of digits
 * @returns The formatted number(e.g. 1.5K)
 */
export function formatBigNumber(value: number, precision = 0): string {
  return helper.formatNumber(value, precision, settings.bigNumberSuffixes);
}

export function setColorToRgba(color: string, alpha: number) {
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  return hexToRgb(color);
}
