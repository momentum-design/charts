import { settings } from './settings';
import { defaultTheme, ThemeKey } from './theme';

describe('settings', () => {
  it('should have the default theme', () => {
    expect(settings.theme).toBe(defaultTheme);
  });

  it('should change the default settings by calling `set()` method', () => {
    settings.set({ theme: ThemeKey.ColorHealth });
    expect(settings.theme).toBe(ThemeKey.ColorHealth);
  });

  it('should add new theme', () => {
    settings.addTheme('new-theme', ['#000', '#fff']);
    expect(settings.themes.get('new-theme')).toBeTruthy();
  });
});
