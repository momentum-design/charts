import { cloneDeep, get, merge } from 'lodash-es';

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

/**
 * Gets a field from an object.
 * @param obj The source object.
 * @param path The path to find.
 * @returns The field in the source object.
 */
export function getFieldFromObject<T>(obj: object, path: string): T {
  return get(obj, path) as T;
}

/**
 * Splits and gets the item by the specified index.
 * @param source The source text,
 * @param separator The separator to split.
 * @param index The index to get.
 * @returns A string or null.
 */
export function splitAndGet(source: string, separator: string, index: number | 'last'): string | null {
  if (!source) {
    return null;
  }

  const items = source.split(separator);
  let indexToGet = index;
  if (indexToGet === 'last') {
    indexToGet = items.length - 1;
  }
  if (indexToGet < items.length) {
    return items[indexToGet];
  }
  return null;
}

/**
 * Checks if the strings of object one and two are consistent.
 * @param obj1 The first object.
 * @param obj2 The second object.
 * @returns true if the string is same, otherwise false.
 */
export function equalsJSONString(obj1: object, obj2: object): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Debounces a function call.
 * @param debounceId The debounce id, it should be only a variable without initialization.
 * @param func The function to be called.
 * @param delay The debounce time in millisecond.
 * @returns The debounce id should be assigned back to the variable.
 */
export function debounce(
  debounceId: ReturnType<typeof setTimeout> | undefined,
  func: () => void,
  delay: number,
): ReturnType<typeof setTimeout> {
  if (debounceId) {
    clearTimeout(debounceId);
  }
  return setTimeout(() => {
    func();
  }, delay);
}
