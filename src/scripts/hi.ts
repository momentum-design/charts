/**
 * Gets sum for parameter 1 and 2
 * Usually Babel will place helpers at the top of your file to do common tasks to avoid duplicating the code around in the current file. Sometimes these helpers can get a little bulky and add unnecessary duplication across files. The runtime transformer replaces all the helper calls to a module.
 * @param v1 The first parameter
 * @param v2 The second parameter
 * @returns The sum of v1 and v2
 */
export function plus(v1: number, v2: number): number {
  return v1 + v2;
}
