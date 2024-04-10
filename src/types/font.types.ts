export type FontWeight = 'normal' | 'bold' | 'lighter' | 'bolder' | number;

export type Font = {
  size?: number;
  family?: string;
  style?: string;
  weight?: FontWeight;
  color?: string;
  lineHeight?: string | number;
};

export enum FontKeys {
  Size = 'size',
  Family = 'family',
  Style = 'style',
  Weight = 'weight',
  Color = 'color',
  LineHeight = 'lineHeight',
}

export type FontValueTypes = string | number | undefined;
