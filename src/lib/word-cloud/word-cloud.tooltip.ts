import { TooltipLabelStyle, TooltipOptions } from 'chart.js/auto';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { WordCloudTooltipContext } from './word-cloud.types';

export const tooltip: _DeepPartialObject<TooltipOptions<'wordCloud'>> = {
  usePointStyle: true,
  callbacks: {
    label: (context: WordCloudTooltipContext): string => {
      let label = context.dataset.label || '';

      if (label) {
        label += ': ';
      }
      if (context.parsed.y !== null) {
        label += new Intl.NumberFormat().format(context.parsed.y);
        //new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
      }
      return label;
    },
    labelColor: (context: WordCloudTooltipContext): TooltipLabelStyle => {
      return {
        borderColor: context.element.options.color,
        backgroundColor: context.element.options.color,
        borderWidth: 0,
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
