import { settings } from '../../src/core/settings';
import { formatNumber, isEmptyObject } from '../../src/helpers/data';

describe('helpers', () => {
  describe('formatNumber', () => {
    test.each([
      [1, 0, '1'],
      [12, 1, '12'],
      [12.34567, 1, '12.3'],
      [12.34567, 2, '12.35'],
      [12.34567, 3, '12.346'],
      [123456.34567, 3, '123,456.346'],
      [-123456.34567, 3, '-123,456.346'],
    ])('%i: %i -> %s', (v, p0, expected0) => {
      expect(formatNumber(v, p0)).toBe(expected0);
    });
  });

  describe('formatNumber with bigNumberSuffixes', () => {
    test.each([
      [999, 0, '999', 1, '999'],
      [1000, 0, '1K', 1, '1K'],
      [1234, 0, '1K', 1, '1.2K'],
      [1000000, 0, '1M', 1, '1M'],
      [1234567, 0, '1M', 1, '1.2M'],
      [1234567, 0, '1M', 4, '1.2346M'],
      [1254567, 0, '1M', 1, '1.3M'],
      [1000000000, 0, '1G', 1, '1G'],
      [1251000001, 0, '1G', 1, '1.3G'],
      [1000000000000, 0, '1T', 1, '1T'],
      [1250000000000, 0, '1T', 1, '1.3T'],
    ])('%i: %i -> %s, %i -> %s', (v, p0, expected0, p1, expected1) => {
      expect(formatNumber(v, p0, settings.bigNumberSuffixes)).toBe(expected0);
      expect(formatNumber(v, p1, settings.bigNumberSuffixes)).toBe(expected1);
    });
  });

  describe('isEmptyObject', () => {
    test.each([
      [{}, true],
      [0, false],
      [1, false],
      [null, false],
      [undefined, false],
      [{ a: 12 }, false],
    ])('`%o` should be %o', (p, r) => {
      expect(isEmptyObject(p)).toBe(r);
    });
  });
});
