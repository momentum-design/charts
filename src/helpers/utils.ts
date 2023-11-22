import { ChartType as ChartJSType } from 'chart.js';
import { ChartType } from '../types';

export function toChartJSType(type?: string): ChartJSType {
  let chartType: ChartJSType;
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
