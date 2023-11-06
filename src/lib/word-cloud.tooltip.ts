import { TooltipOptions } from 'chart.js/auto';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { WordCloudTooltipContext } from './word-cloud.types';

export const tooltip: _DeepPartialObject<TooltipOptions<'wordCloud'>> = {
  callbacks: {
    label: (context: WordCloudTooltipContext): string => {
      let label = context.dataset.label || '';

      if (label) {
        label += ': ';
      }
      console.log(context.dataset);
      if (context.parsed.y !== null) {
        label += new Intl.NumberFormat().format(context.parsed.y);
        //new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
      }
      return label;
    },
  },
};
