import { Chart as CJ, ChartEvent, Plugin } from 'chart.js/auto';
import { Chart } from '../../lib/.internal';
import { ChartData, ChartOptions, ChartType } from '../../types';

export class CategoryAxisClickable<TChart extends Chart<ChartData, ChartOptions>> {
  constructor(public chart: TChart) {}

  private datasetColors: {
    [key: string]: string[];
  } = {};

  public selectedItems: string[] = [];
  public changeSelectedItems(items: string[]): void {
    this.selectedItems = items;
    if (this.chart.api) {
      this.setSelectedItems(this.chart.api as CJ<ChartType.Bar | ChartType.Line>);
    }
  }
  getPlugin(opts?: { onItemClick?: (label: string | undefined, selectedItems: string[]) => void }): Plugin {
    return {
      id: 'categoryClickable',
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
              const activeItem = labels[labelIndex] as string;
              const index = this.selectedItems.findIndex((item) => item === activeItem);
              if (index === -1) {
                this.selectedItems.push(activeItem as string);
              } else {
                this.selectedItems.splice(index, 1);
              }
              this.setSelectedItems(chart, opts, activeItem);
            }
          }
        }
      },
    };
  }

  setSelectedItems(
    chart: CJ<'bar' | 'line'>,
    opts?: { onItemClick?: (label: string | undefined, selectedItems: string[]) => void },
    activeItem?: string,
  ) {
    const changedColorStatus = chart.data.labels?.map((label) => {
      return this.selectedItems.indexOf(label as string) >= 0;
    });
    if (changedColorStatus && changedColorStatus.length > 0) {
      chart.data.datasets.forEach((dataset) => {
        if (!dataset.label) {
          return;
        }
        let backgroundColors = this.datasetColors[dataset.label];
        if (!backgroundColors) {
          if (typeof dataset.backgroundColor === 'string') {
            backgroundColors = Array(changedColorStatus.length).fill(dataset.backgroundColor);
          } else {
            backgroundColors = dataset.backgroundColor as string[];
          }
          this.datasetColors[dataset.label] = [...backgroundColors];
        }
        if (this.selectedItems.length > 0) {
          backgroundColors = changedColorStatus.map((value, index) =>
            value ? backgroundColors[index] : backgroundColors[index] + '4D',
          );
        }
        dataset.backgroundColor = backgroundColors;
      });
    }
    if (typeof opts?.onItemClick === 'function') {
      opts.onItemClick(activeItem, this.selectedItems);
    }
    chart.update();
  }
}
