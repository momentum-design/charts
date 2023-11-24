import { TooltipItem } from 'chart.js/auto';
import { EventContext } from '../../events';
import { ChartOptions } from '../../types';

export interface WordCloudOptions extends ChartOptions {
  hoverColor?: string;
  minFontSize?: number;
  maxFontSize?: number;

  onWordClick?: (context: WordClickContext) => void;
}

export type WordCloudData = { word: string; value: number }[] | { [key: string]: number };

export type WordCloudTooltipContext = TooltipItem<'wordCloud'> & { parsed: { y: number | null } };

export type WordClickData = { text: string; value: number };

export type WordClickContext = EventContext<WordClickData>;
