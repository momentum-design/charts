import chroma from 'chroma-js';

export function getRandomColor(): string {
  return chroma.random().hex();
}

export function getRandomColors(count: number): string[] {
  const result = [];
  for (let i = count; i > 0; i--) {
    result.push(getRandomColor());
  }
  return result;
}

export function getBrightColors(baseColor: string, count: number): string[] {
  return chroma.scale([baseColor, '#ffffff']).colors(count);
}

export function getDarkColors(baseColor: string, count: number): string[] {
  return chroma.scale([baseColor, '#000000']).colors(count);
}

export function getScaleColors(colors: string[], count: number): string[] {
  return chroma.scale(colors).colors(count);
}

/**
 * Set alpha for color.
 * @param color The color value
 * @param ratio The alpha [0..1]
 * @returns A color string with alpha
 */
export function alphaColor(color: string, alpha: number): string {
  return chroma(color).alpha(alpha).hex();
}

export function lightenColor(color: string, ratio?: number): string {
  return chroma(color).brighten(ratio).hex();
}

export function darkenColor(color: string, ratio?: number): string {
  return chroma(color).darken(ratio).hex();
}
