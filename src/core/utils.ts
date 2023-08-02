import { settings } from './settings';

/**
 * Gets the current theme object.
 *
 * @returns the current theme object
 */
export function getCurrentTheme(): { name: string; colors: string[] | undefined } {
  return {
    name: settings.theme,
    colors: settings.themes.get(settings.theme),
  };
}
