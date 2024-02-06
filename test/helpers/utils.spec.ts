import { isEmptyObject } from '../../src/helpers/utils';

describe('helpers:utils', () => {
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
