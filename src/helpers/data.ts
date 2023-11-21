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
