import { Chart as ChartJS, ChartConfiguration } from 'chart.js/auto';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { TableData } from '../../types';
import { Chart } from '../.internal';
import { tooltip } from './word-cloud.tooltip';
import { WordCloudData, WordCloudOptions } from './word-cloud.types';

// remove the default value, otherwise the tooltip point appears with the hover color sometimes.
// see https://github.com/sgratzl/chartjs-chart-wordcloud/blob/main/src/elements/WordElement.ts#L99
WordElement.defaults.hoverColor = undefined;

ChartJS.register(WordCloudController, WordElement);

export class WordCloudChart extends Chart<WordCloudData, WordCloudOptions> {
  /**
   * The default options for Word Cloud chart.
   */
  static readonly defaultOptions: WordCloudOptions = {};

  getTableData(): TableData {
    // TODO(bndynet): coming soon
    throw new Error('Method not implemented.');
  }

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
  getConfiguration(): ChartConfiguration<'wordCloud'> | null {
    let finalData;
    if (Array.isArray(this.data)) {
      finalData = this.data.map((item) => {
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
      finalData = Object.keys(this.data).map((key) => ({ key, value: (<any>this.data)[key] }));
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
            color: ['#dd0000', '#ff0000', '#00ff00'], // TODO
            fit: true,
          },
        ],
      },
      options: {
        elements: {
          word: {
            hoverColor: this.options?.hoverColor,
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

  protected getDefaultOptions(): WordCloudOptions {
    return WordCloudChart.defaultOptions;
  }
}
