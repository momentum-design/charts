/** A type alias for string or null */
export type StringOrNull = string | null;

/** A type alias for key value pair */
export type KeyValuePair = { key: string; value: string };

export type Padding = Partial<TRBL>;

export type TRBL = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export enum KeyboardCode {
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowUp = 'ArrowUp',
  Enter = 'Enter',
}
