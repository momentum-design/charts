import { ChartType as CJType } from 'chart.js';
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
