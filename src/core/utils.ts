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
 * Decreases the opacity of a color. Its range for the amount is between 0 to 1.
 *
 * @param {string} color - Color string in hexadecimal format (e.g., '#FFD700').
 * @param {number} opacity - Opacity value, ranging from 0 (completely transparent) to 1 (completely opaque).
 * @returns {string} A new color string including the specified opacity.
 */
export function transparentizeColor(color: string, opacity: number): string {
  const hexColor = color.replace(/^#/, '');
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, opacity))})`;
}
