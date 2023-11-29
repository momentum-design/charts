export type FontWeight = 'normal' | 'bold' | 'lighter' | 'bolder' | number;

export type Font = {
  size?: number;
  family?: string;
  style?: string;
  weight?: FontWeight;
  color?: string;
  lineHeight: string | number;
};
