import { ChartType as CJType, FontSpec } from 'chart.js/auto';
import * as helper from '../helpers';
import { ChartType } from '../types';
import { settings } from './settings';

/**
 * Gets the current ColorSet object.
 *
 * @returns The current ColorSet object
 */
export function getCurrentColorSet(): { name: string; colors: string[] | undefined } {
  return {
    name: settings.colorSet,
    colors: settings.colorSets.get(settings.colorSet),
  };
}

/**
 * Gets colors by the specified ColorSet.
 *
 * @param name The ColorSet name
 * @returns An array which includes all colors in this ColorSet or undefined.
 */
export function getColorsByName(name: string): string[] | undefined {
  return settings.colorSets.get(name);
}

/**
 * Gets color by specified index number in the colorSets.
 *
 * @param name The ColorSet name.
 * @param index The index of color.
 * @returns A color if matched, otherwise an empty string.
 */
export function getColor(name: string, index: number): string {
  const colors = getColorsByName(name);
  if (colors && index < colors?.length) {
    return colors[index];
  }
  return '';
}

/**
 * Gets color of specified index from an array of color.
 * First get from the specified colors. If not matched, then from the colorSet.
 *
 * @param index The index in the array of color.
 * @param colors The array of color. It is optional.
 * @param colorSetName The ColorSet name which should be defined or under built-in themes.
 * @returns The color string or empty string if not matched.
 */
export function getColorForChart(index: number, colors?: string[], colorSetName?: string): string {
  if (colors && colors.length > index) {
    return colors[index];
  }

  if (colorSetName) {
    const themeColors = getColorsByName(colorSetName);
    if (themeColors && themeColors.length > index) {
      return themeColors[index];
    }
  }

  return '';
}

/**
 * By FontSpec object, get the font abbreviation style.
 *
 * @param fontSpec FontSpec object
 * @returns Abbreviation Style: [font-weight][font-size][font-family]
 */
export function getFontStyleAbbreviation(fontSpec: Partial<FontSpec>): string {
  return `${fontSpec.weight ?? ''} ${fontSpec.size}px ${fontSpec.family ?? ''}`;
}

/**
 * Formats the big number with specified suffix({@link settings.bigNumberSuffixes})
 * @param value The number
 * @param precision The number of digits
 * @returns The formatted number(e.g. 1.5K)
 */
export function formatBigNumber(value: number, precision = 0): string {
  return helper.formatNumber(value, precision, settings.bigNumberSuffixes);
}

/**
 * Converts to chart type of chart.js.
 * @param type The built-in chart type.
 * @returns The chart type of chart.js.
 */
export function convertToCJType(type: string | ChartType): CJType {
  let chartType: CJType;
  switch (type) {
    case ChartType.Bar:
    case ChartType.Column:
      chartType = 'bar';
      break;
    case ChartType.Line:
    case ChartType.Area:
    case ChartType.Range:
    case 'dashed':
    case 'dashedArea':
      chartType = 'line';
      break;
    case ChartType.Pie:
      chartType = 'pie';
      break;
    case ChartType.Gauge:
    case ChartType.Donut:
      chartType = 'doughnut';
      break;
    default:
      chartType = 'bar';
      break;
  }
  return chartType;
}

/**
 * Checks if the given chart type is a Pie chart.
 *
 * This function determines if the provided chart type is one of the Pie charts.
 * Pie charts include Pie, Donut, and Gauge charts.
 *
 * @param {string | ChartType} type - The chart type to check, which can be a string or a ChartType enumeration.
 * @returns {boolean} - Returns true if the given chart type is a Pie chart; otherwise, returns false.
 */
export function isPieChart(type: string | ChartType): boolean {
  return type === ChartType.Pie || type === ChartType.Donut || type === ChartType.Gauge;
}

/**
 * Checks if the given chart type is an XY chart.
 *
 * This function determines if the provided chart type is one of the XY charts.
 * XY charts include Bar, Column, Line, Area, and Range charts.
 *
 * @param {string | ChartType} type - The chart type to check, which can be a string or a ChartType enumeration.
 * @returns {boolean} - Returns true if the given chart type is an XY chart; otherwise, returns false.
 */
export function isXYChart(type: string | ChartType): boolean {
  return (
    type === ChartType.Bar ||
    type === ChartType.Column ||
    type === ChartType.Line ||
    type === ChartType.Area ||
    type === ChartType.Range
  );
}
