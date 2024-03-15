import { Chart as CJ, ChartEvent, Plugin } from 'chart.js/auto';
import { padToArray } from '../../helpers/utils';
import { ChartData, ChartOptions, ChartType } from '../../types';
import { Chart } from '../.internal';

export class CategoryLabelSelectable<TChart extends Chart<ChartData, ChartOptions>> {
  constructor(public chart: TChart) {}

  private datasetColors: {
    [key: string]: string[];
  } = {};

  public selectedLabels: string[] = [];

  public changeSelectedLabels(labels: string[]): void {
    this.selectedLabels = labels;
    if (this.chart.api) {
      this.setSelectedLabels(this.chart.api as CJ<ChartType.Bar | ChartType.Line>);
    }
  }

  getPlugin(opts?: {
    labelSelectable?: boolean;
    onLabelClick?: (label: string | undefined, selectedLabels?: string[]) => void;
  }): Plugin {
    return {
      id: 'categoryLabelSelectable',
      start: () => {},
      beforeInit: () => {},
      afterEvent: (
        chart: CJ<ChartType.Bar | ChartType.Line>,
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
          const isHorizontal = chart.options.indexAxis === 'y';
          const xScale = Object.values(chart.scales).find(
            (scale) => scale.id === (isHorizontal ? 'valueAxis' : 'categoryAxis'),
          );
          const yScale = Object.values(chart.scales).find(
            (scale) => scale.id === (isHorizontal ? 'categoryAxis' : 'valueAxis'),
          );
          if (!xScale || !yScale || !labels) {
            return;
          }
          const baseXPixel = xScale.getBasePixel();
          const baseYPixel = yScale.getBasePixel();
          if ((isHorizontal && y < baseYPixel && x < baseXPixel) || (!isHorizontal && y > baseYPixel)) {
            const labelIndex = isHorizontal ? yScale.getValueForPixel(y) : xScale.getValueForPixel(x);
            const baseValue = isHorizontal ? yScale.getBaseValue() : xScale.getBaseValue();
            if (labelIndex != undefined && labelIndex >= 0 && labelIndex >= baseValue) {
              const activeLabel = labels[labelIndex] as string;
              const index = this.selectedLabels.findIndex((item) => item === activeLabel);
              if (index === -1) {
                this.selectedLabels.push(activeLabel as string);
              } else {
                this.selectedLabels.splice(index, 1);
              }
              if (opts?.labelSelectable) {
                this.setSelectedLabels(chart, opts, activeLabel);
              } else if (typeof opts?.onLabelClick === 'function') {
                opts.onLabelClick(activeLabel);
              }
            }
          }
        }
      },
    };
  }

  setSelectedLabels(
    chart: CJ<'bar' | 'line'>,
    opts?: { onLabelClick?: (label: string | undefined, selectedLabels?: string[]) => void },
    activeLabel?: string,
  ) {
    const colorsStatus = chart.data.labels?.map((label) => {
      return this.selectedLabels.indexOf(label as string) >= 0;
    });
    if (colorsStatus && colorsStatus.length > 0) {
      chart.data.datasets.forEach((dataset) => {
        if (!dataset.label) {
          return;
        }
        let backgroundColors = this.datasetColors[dataset.label];
        if (!backgroundColors && dataset.backgroundColor) {
          backgroundColors = padToArray(
            typeof dataset.backgroundColor === 'string'
              ? (dataset.backgroundColor as string)
              : (dataset.backgroundColor as string[]),
            colorsStatus.length,
          );
          this.datasetColors[dataset.label] = [...backgroundColors];
        }
        if (this.selectedLabels.length > 0) {
          backgroundColors = colorsStatus.map((value, index) =>
            value ? backgroundColors[index] : backgroundColors[index] + '8D',
          );
        }
        dataset.backgroundColor = backgroundColors;
      });
    }
    if (typeof opts?.onLabelClick === 'function') {
      opts.onLabelClick(activeLabel, this.selectedLabels);
    }
    chart.update();
  }
}
