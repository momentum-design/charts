/* eslint-disable @typescript-eslint/no-empty-interface */
import { ChartConfiguration, ChartConfigurationCustomTypesPerDataset } from 'chart.js/auto';
import { customElement } from 'lit/decorators.js';
import { ChartElement, COMPONENT_PREFIX } from '../../core';
import { chartA11y, chartLegendA11y } from '../../core/plugins';
import { getColor, getCurrentTheme } from '../../core/utils';

interface HelloChartData {}
interface HelloChartOptions {}

/**
 * @ignore
 */
@customElement(`${COMPONENT_PREFIX}-hello-chart`)
export class HelloChart extends ChartElement<HelloChartData, HelloChartOptions> {
  protected getChartJSConfiguration(): ChartConfiguration | ChartConfigurationCustomTypesPerDataset {
    const theme = getCurrentTheme().name;
    return {
      type: 'bar',
      data: {
        labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
        datasets: [
          {
            label: 'Alabama',
            data: [2943, 5226, 3318, 7295, 2057, 2820, 6006],
            backgroundColor: getColor(theme, 0),
          },
          {
            label: 'Colorado',
            data: [1238, 8755, 7558, 226, 739, 7605, 2373],
            backgroundColor: getColor(theme, 1),
          },
          {
            label: 'Arizona',
            data: [2225, 8494, 3911, 2627, 3289, 8502, 6616],
            backgroundColor: getColor(theme, 2),
          },
          {
            label: 'Vermont',
            data: [2911, 4771, 5051, 9445, 5786, 9244, 6609],
            backgroundColor: getColor(theme, 3),
          },
          {
            label: 'South Carolina',
            data: [8372, 4470, 5989, 6776, 9380, 8162, 1007],
            backgroundColor: getColor(theme, 4),
          },
          {
            label: 'New Hampshire',
            data: [2240, 6799, 54, 1826, 6353, 8343, 158],
            backgroundColor: getColor(theme, 5),
          },
          {
            label: 'Montana',
            data: [1391, 7162, 594, 6715, 8428, 4129, 5342],
            backgroundColor: getColor(theme, 6),
          },
          {
            label: 'Virginia',
            data: [6246, 6764, 8676, 809, 1967, 2533, 3677],
            backgroundColor: getColor(theme, 7),
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
      plugins: [chartA11y, chartLegendA11y],
    };
  }
}
