/**
 * Converts a two-dimensional array to JSON.
 * @param {unknown[][]} data - Two-dimensional array.
 * @returns {Record<string, string | number>[]} JSON array.
 */
export function tableDataToJSON(data: unknown[][]): Record<string, string | number>[] {
  const [columns, ...rows] = data;
  const result: Record<string, string | number>[] = [];
  rows.forEach((row) => {
    const record: Record<string, string | number> = {};
    columns.forEach((column, index) => {
      record[column as string] = row[index] as string | number;
    });
    result.push(record);
  });
  return result;
}

/**
 * Converts JSON to a two-dimensional array.
 * @param {Record<string, string | number>[]} data - JSON array.
 * @returns {unknown[][]} Two-dimensional array.
 */
export function jsonToTableData(data: Record<string, string | number>[]): unknown[][] {
  const keys = Object.keys(data[0]);
  const header = keys.map((key) => key);
  const rows = data.map((item) => keys.map((key) => item[key]));
  return [header, ...rows];
}

/**
 * Formats the big number.
 * @param value The number
 * @param precision The number of digits
 * @param formats The formats
 * @returns The formatted value
 */
export function formatNumber(value: number, precision: number, formats?: { number: number; suffix: string }[]): string {
  let result = '';
  if (formats) {
    const sortedFormats = formats.sort((a, b) => b.number - a.number);
    const format = sortedFormats.find((format) => value >= format.number);
    if (format) {
      if (precision > 0) {
        result = `${Math.round((value * Math.pow(10, precision)) / format.number) / Math.pow(10, precision)}${
          format.suffix
        }`;
      } else {
        result = `${Math.round(value / format.number)}${format.suffix}`;
      }
    }
  }

  if (!result) {
    result = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: precision,
    })
      .format(precision > 0 ? Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision) : Math.round(value))
      .toString();
  }

  return result;
}

/**
 * Checks if the object value has no any keys. e.g. {}
 * @param value The object
 * @returns true if `{}`, otherwise false.
 */
export function isEmptyObject(value: Record<string, unknown>): boolean {
  if (value && typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  return false;
}

export function getCombinedKeys(data: Record<string, any>[]): string[] {
  const mergedKeys = new Set<string>();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      mergedKeys.add(key);
    });
  });
  return Array.from(mergedKeys);
}
