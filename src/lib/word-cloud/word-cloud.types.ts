import { TooltipItem } from 'chart.js/auto';
import { ChartEvent, ChartOptions, EventContext } from '../../types';

export interface WordCloudOptions extends ChartOptions {
  hoverColor?: string;
  minFontSize?: number;
  maxFontSize?: number;

  onWordClick?: (event: ChartEvent<WordClickData>) => void;
}

export type WordCloudData = { word: string; value: number }[] | { [key: string]: number };

export type WordCloudTooltipContext = TooltipItem<'wordCloud'> & { parsed: { y: number | null } };

export type WordClickData = { word: string; value: number };

export type WordClickContext = EventContext<WordClickData>;
