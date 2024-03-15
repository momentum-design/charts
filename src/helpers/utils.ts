import { cloneDeep, merge } from 'lodash-es';

export function mergeObjects<TObject1>(object1: TObject1): TObject1;
export function mergeObjects<TObject1, TObject2>(object1: TObject1, object2: TObject2): TObject1 & TObject2;
export function mergeObjects<TObject1, TObject2, TObject3>(
  object1: TObject1,
  object2: TObject2,
  object3: TObject2,
): TObject1 & TObject2 & TObject3;
export function mergeObjects<TObject1, TObject2, TObject3, TObject4>(
  object1: TObject1,
  object2: TObject2,
  object3: TObject2,
  object4: TObject4,
): TObject1 & TObject2 & TObject3 & TObject4;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeObjects(...objs: any[]): any {
  return merge({}, ...objs);
}

/**
 * Merges objects to the source object.
 * @param source The destination object.
 * @param objs The objects to be merged.
 * @returns the destination object with merged fields.
 */
export function mergeObjectsTo<TSource>(source: TSource, ...objs: unknown[]): TSource {
  return merge(source, ...objs);
}

/**
 * Checks if the value is undefined or null
 * @param value the value to be checked
 * @returns true if the value equals undefined or null, otherwise false
 */
export function isNullOrUndefined(param: unknown): boolean {
  return param === null || typeof param === 'undefined';
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

/**
 * Pads to array from source array or array item.
 * It will repeat the array item if the length is greater than source array length.
 *
 * @param itemOrSourceArray The array item or source array.
 * @param length The final array length
 * @returns an new array
 */
export function padToArray<TItem>(itemOrSourceArray: TItem | TItem[], length: number): TItem[] {
  if (length < 0 || !itemOrSourceArray || (Array.isArray(itemOrSourceArray) && itemOrSourceArray.length === 0)) {
    return [];
  }
  const tempArray = Array.isArray(itemOrSourceArray) ? itemOrSourceArray : [itemOrSourceArray];
  return Array.from({ length }, (_, index) => tempArray[index % tempArray.length]);
}

/**
 * Creates a shallow clone of `value`.
 *
 * @param value The value to clone.
 * @returns the cloned value.
 */
export function deepClone<T>(value: T): T {
  return cloneDeep(value);
}
