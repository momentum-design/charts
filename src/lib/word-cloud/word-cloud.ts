import { Chart as ChartJS, ChartConfiguration } from 'chart.js/auto';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { tooltip } from './word-cloud.tooltip';
import { WordCloudData, WordCloudOptions } from './word-cloud.types';

ChartJS.register(WordCloudController, WordElement);

/**
 * Gets the configuration for Word Cloud chart.
 *
 * @example The data parameter can be following formats:
 * ```json
 * ['hello', 'world']
 * {'hello': 100, 'world': 30}
 * [{key: 'hello', value: 100}, {key: 'world', value: 30}}]
 * ```
 *
 * @param data - The data for Word Cloud chart.
 * @returns A configuration of Word Cloud chart.
 */
export function getWordCloudConfiguration(data: WordCloudData, options: WordCloudOptions): ChartConfiguration<'wordCloud'> | null {
  let finalData;
  if (Array.isArray(data)) {
    finalData = data.map((item) => {
      if (typeof item === 'string') {
        return { key: item, value: Math.floor(Math.random() * 10) };
      }
      const dKeys = Object.keys(item);
      if (!dKeys.includes('key')) {
        throw new Error('The data you provided for Word Cloud does not have the property named `key`.');
      }
      return item;
    });
  } else {
    finalData = Object.keys(data).map((key) => ({ key, value: data[key] }));
  }

  if (!finalData) {
    return null;
  }

  return {
    type: WordCloudController.id,
    data: {
      labels: finalData.map((item) => item.key),
      datasets: [
        {
          label: '',
          data: finalData.map((item) => item.value),
          color: ['#dd0000', '#ff0000', '#00ff00'],
        },
      ],
    },
    options: {
      elements: {
        word: {
          color: 'red',
          hoverColor: options.hoverColor,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip,
      },
    },
  };
}
