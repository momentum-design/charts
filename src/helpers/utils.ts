import { ChartType as CJType } from 'chart.js/auto';
import merge from 'lodash-es/merge';
import { ChartType } from '../types';

export function toChartJSType(type?: string): CJType {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeObjects(...objs: any[]): any {
  return merge({}, ...objs);
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

export function getColorsByLength(sourceColor: string | string[], length: number): string[] {
  if (typeof sourceColor === 'string') {
    return Array.from({ length }, () => sourceColor);
  }
  return Array.from({ length }, (_, index) => sourceColor[index % sourceColor.length]);
}
