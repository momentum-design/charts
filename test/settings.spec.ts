import { ColorSetName, defaultColorSet } from '../src/core/colorsets';
import { settings } from '../src/core/settings';

describe('settings', () => {
  it('should have the default ColorSet', () => {
    expect(settings.colorSet).toBe(defaultColorSet);
  });

  it('should change the default settings by calling `set()` method', () => {
    settings.set({ colorSet: ColorSetName.Material });
    expect(settings.colorSet).toBe(ColorSetName.Material);
  });

  it('should add new colorSet', () => {
    settings.addColorSet('new-colorSet', ['#000', '#fff']);
    expect(settings.themes.get('new-colorSet')).toBeTruthy();
  });
});
