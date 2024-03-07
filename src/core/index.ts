import { ChartEventType } from '../types';
import { settings } from './settings';

export * from './colorsets';
export * from './constants';
export * from './settings';
export * from './themes';
export * from './utils';

export function changeTheme(name: string, defaultColorSet?: string): void {
  settings.set({ theme: name });
  if (defaultColorSet) {
    settings.set({
      colorSet: defaultColorSet,
    });
  }
  document.dispatchEvent(
    new CustomEvent(ChartEventType.ThemeChange, {
      detail: name,
    }),
  );
}
