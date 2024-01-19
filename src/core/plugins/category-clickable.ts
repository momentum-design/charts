import { Chart as CJ, ChartEvent, Plugin } from 'chart.js/auto';
import { Chart } from '../../lib/.internal';
import { ChartData, ChartOptions } from '../../types';

export class CategoryAxisClickable<TChart extends Chart<ChartData, ChartOptions>> {
  constructor(public chart: TChart) {}

  getPlugin(opts?: { onItemClick?: (chart: TChart, label: string) => void }): Plugin {
    return {
      id: 'categoryClickable',
      start: () => {},
      beforeInit: () => {},
      afterEvent: (
        chart: CJ<'bar' | 'line'>,
        event: {
          event: ChartEvent;
          replay: boolean;
          changed?: boolean | undefined;
          cancelable: false;
          inChartArea: boolean;
        },
      ) => {
        const { type, x, y } = event.event;
        if (type === 'click' && typeof x === 'number' && typeof y === 'number') {
          const labels = chart.data.labels;
          const isHorizontal = chart.options.indexAxis === 'x';
          const xScale = Object.values(chart.scales).find(
            (s) => s.id === (isHorizontal ? 'categoryAxis' : 'valueAxis'),
          );
          const yScale = Object.values(chart.scales).find(
            (s) => s.id === (isHorizontal ? 'valueAxis' : 'categoryAxis'),
          );
          if (!xScale || !yScale || !labels) {
            return;
          }
          const basePixel = isHorizontal ? yScale.getBasePixel() : xScale.getBasePixel();
          if ((isHorizontal && y > basePixel) || (!isHorizontal && x < basePixel)) {
            const labelIndex = isHorizontal ? xScale.getValueForPixel(x) : yScale.getValueForPixel(y);
            if (labelIndex !== undefined) {
              const label = labels[labelIndex];
              console.log('label', label);
              if (typeof opts?.onItemClick === 'function') {
                opts.onItemClick(this.chart, labels[labelIndex] as string);
              }
            }
          }
        }
      },
    };
  }
}
