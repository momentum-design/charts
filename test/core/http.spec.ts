import { parseUrlPattern, requestOptionsToString } from '../../src';

describe('http', () => {
  describe('should parse the url attribute', () => {
    test.each([
      [`http://example.com`, `get>>http://example.com`],
      [`https://example.com`, `get>>https://example.com`],
      [`https://example.com/api`, `get>>https://example.com/api`],
      [`https://example.com:3000/api`, `get>>https://example.com:3000/api`],
      [`https://example.com:3000/api#root.items[1]`, `get>>https://example.com:3000/api`],
      [`post>>https://example.com:3000/api>>{"a": 1,"b":"b"}`, `post>>https://example.com:3000/api>>{"a":1,"b":"b"}`],
    ])('%s -> %s', (a, b) => {
      expect(requestOptionsToString(parseUrlPattern(a))).toBe(b);
    });
  });
});
