import {
  ActiveElement,
  Chart as CJ,
  ChartConfiguration,
  ChartEvent as CJEvent,
  TooltipLabelStyle,
  TooltipOptions,
} from 'chart.js/auto';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { alphaColor } from '../../helpers';
import { ChartEvent, ChartEventType, TableData } from '../../types';
import { Chart } from '../.internal';
import {
  WordClickContext,
  WordClickData,
  WordCloudData,
  WordCloudOptions,
  WordCloudTooltipContext,
} from './word-cloud.types';

// remove the default value, otherwise the tooltip point appears with the hover color sometimes.
// see https://github.com/sgratzl/CJ-chart-wordcloud/blob/main/src/elements/WordElement.ts#L99
WordElement.defaults.hoverColor = undefined;

CJ.register(WordCloudController, WordElement);

/**
 * A chart about word cloud.
 *
 * @example The data can be following formats:
 * ```json
 * {'hello': 100, 'world': 30} // or
 * [{word: 'hello', value: 100}, {word: 'world', value: 30}}]
 * ```
 */
export class WordCloudChart extends Chart<WordCloudData, WordCloudOptions> {
  private minValue = 0;
  private maxValue = 1;
  private finalData?: { word: string; value: number }[];

  /**
   * The default options for Word Cloud chart.
   */
  static readonly defaultOptions: WordCloudOptions = {
    minFontSize: 12,
    maxFontSize: 80,
  };

  getTableData(): TableData {
    // TODO(bndynet): coming soon
    throw new Error('Method not implemented.');
  }

  getConfiguration(): ChartConfiguration<'wordCloud'> | null {
    if (Array.isArray(this.data)) {
      this.finalData = this.data.map((item) => {
        if (typeof item === 'string') {
          return { word: item, value: Math.floor(Math.random() * 10) };
        }
        const dKeys = Object.keys(item);
        if (!dKeys.includes('word')) {
          throw new Error('The data you provided for Word Cloud does not have the property named `word`.');
        }
        return item;
      });
    } else {
      this.finalData = Object.keys(this.data).map((key) => ({ word: key, value: (<any>this.data)[key] }));
    }

    if (!this.finalData) {
      return null;
    }

    const words = this.finalData.map((item) => item.word);
    const values = this.finalData.map((item) => item.value);
    this.minValue = Math.min(...values);
    this.maxValue = Math.max(...values);

    return {
      type: WordCloudController.id,
      data: {
        labels: words,
        datasets: [
          {
            label: '',
            data: this.finalData.map((item) => this.getFontSize(item.value)),
            color: this.getColorsForKeys(words),
            fit: true,
          },
        ],
      },
      options: {
        onClick: (event: CJEvent, clickedElements: ActiveElement[]) => {
          if (clickedElements?.length === 0) {
            return;
          }
          const selectedWord = (clickedElements[0].element as WordElement).getProps(['text']).text;
          const selectedItem = this.finalData?.find((item) => item.word === selectedWord);
          if (selectedItem) {
            const clickContext: WordClickContext = {
              data: {
                word: selectedItem.word,
                value: selectedItem.value,
              },
              chart: this,
            };
            const evt = new ChartEvent<WordClickData>(ChartEventType.WorkClick, clickContext);
            if (this.options.onWordClick) {
              this.options.onWordClick(evt);
            }
            this.rootElement?.dispatchEvent(evt);
          }
        },
        elements: {
          word: {
            hoverColor: this.options?.hoverColor,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: this.getTooltipConfiguration(),
        },
      },
    };
  }

  protected getDefaultOptions(): WordCloudOptions {
    return WordCloudChart.defaultOptions;
  }

  private getTooltipConfiguration(): _DeepPartialObject<TooltipOptions<'wordCloud'>> {
    return {
      usePointStyle: true,
      titleFont: this.getCJFont(),
      bodyFont: this.getCJFont(),
      footerFont: this.getCJFont(),
      callbacks: {
        title: (context: WordCloudTooltipContext[]): string | void | string[] =>
          (context.length > 0 && context[0].dataset.label) || '',
        label: (context: WordCloudTooltipContext): string => {
          let label = context.label;

          if (label) {
            label += ': ';
          }

          label += this.getValueWithUnit(
            this.finalData?.find((item) => item.word === context.label)?.value || 0,
            this.options.valueUnit,
          );
          return label;
        },
        labelColor: (context: WordCloudTooltipContext): TooltipLabelStyle => {
          return {
            borderColor: alphaColor(context.element.options.color as string, 0.6),
            backgroundColor: context.element.options.color,
            borderWidth: 1,
            borderRadius: 2,
          };
        },
        labelPointStyle: (context) => {
          return {
            pointStyle: 'rectRounded',
            rotation: 0,
          };
        },
      },
    };
  }

  private getFontSize(value: number): number {
    if (this.options.maxFontSize && this.options.minFontSize) {
      return (
        ((value - this.minValue) / this.maxValue) * (this.options.maxFontSize - this.options.minFontSize) +
        this.options.minFontSize
      );
    }

    throw new Error(`The minFontSize and maxFontSize are required.`);
  }
}
