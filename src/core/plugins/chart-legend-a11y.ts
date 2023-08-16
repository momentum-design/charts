/* eslint-disable */
import type { Chart } from 'chart.js/auto';
import { KeyboardCode } from './plugin.types';

const chartStates = new Map();

export interface HitBoxMeta {
  left: number;
  top: number;
  width: number;
  height: number;
  text: string;
}

class ChartLegendManager {
  hitBoxes: HitBoxMeta[] = [];
  focusBoxMargin: number;
  focusBox: HTMLDivElement;
  chart: any;
  canvas: Chart['canvas'];

  constructor(chart: any, startingMargin = 0) {
    this.focusBoxMargin = startingMargin;
    this.chart = chart;
    this.canvas = chart.canvas;
    this.focusBox = this._generateFocusBox();
    this.canvas.insertAdjacentElement('afterend', this.focusBox);
  }

  suppressFocusBox = () => {
    this.focusBox.setAttribute('tabIndex', '-1');
  };

  reviveFocusBox = () => {
    this.focusBox.setAttribute('tabIndex', '0');
  };

  private _generateFocusBox = () => {
    const focusBox = document.createElement('div');
    focusBox.setAttribute('tabIndex', '0');
    focusBox.setAttribute('data-legend-index', '0');
    focusBox.setAttribute('role', 'option');
    focusBox.setAttribute('aria-selected', 'true');

    const hideFocusBox = () => {
      focusBox.style.left = '-1000px';
    };

    const activateFocusBox = (e: KeyboardEvent | MouseEvent) => {
      const index = Number(focusBox.getAttribute('data-legend-index'));
      if (['pie', 'doughnut'].includes(this.chart.config.type)) {
        // TODO: support Filter Click
        if (this.chart.config.options.isLegendClick) {
          const legendObj = {
            key: this.chart.config.data.labels[index],
            value: this.chart.config.data.datasets[0].data[index as number],
          };
          this.chart.config.options.onLegendClick(legendObj);
        } else {
          this.chart.toggleDataVisibility(index);
          const isVisible = this.chart.getDataVisibility(index);
          focusBox.setAttribute('aria-selected', String(isVisible));
        }
      } else {
        if (this.chart.isDatasetVisible(index)) {
          this.chart.hide(index);
          focusBox.setAttribute('aria-selected', 'false');
        } else {
          this.chart.show(index);
          focusBox.setAttribute('aria-selected', 'true');
        }
      }
      this.chart.update();
      e.preventDefault();
      e.stopPropagation();
    };

    const keyboardNavigation = (e: KeyboardEvent) => {
      const index = Number(focusBox.getAttribute('data-legend-index'));
      const maxIndex = this.hitBoxes.length - 1;
      if (e.key === KeyboardCode.ArrowRight) {
        e.preventDefault();
        e.stopPropagation();
        if (index >= maxIndex) {
          return;
        }
        focusBox.setAttribute('data-legend-index', String(index + 1));
        moveFocusBox();
        return;
      }
      if (e.key === KeyboardCode.ArrowLeft) {
        e.preventDefault();
        e.stopPropagation();
        if (index <= 0) {
          return;
        }
        focusBox.setAttribute('data-legend-index', String(index - 1));
        moveFocusBox();
        return;
      }
      if (e.key === ' ' || e.key === KeyboardCode.Enter) {
        activateFocusBox(e);
        return;
      }
    };

    const moveFocusBox = () => {
      const index = Number(focusBox.getAttribute('data-legend-index'));
      if (isNaN(index)) {
        return;
      }
      const box = this.canvas.getBoundingClientRect();
      const { left, top, width, height, text } = this.hitBoxes[index];

      const newLeft = `${left - this.focusBoxMargin - window.pageXOffset}px`;
      const newTop = `${top - this.focusBoxMargin + window.pageYOffset}px`;
      const newWidth = `${width + 2 * this.focusBoxMargin}px`;
      const newHeight = `${height + 2 * this.focusBoxMargin}px`;
      focusBox.setAttribute('style', `position:absolute; left: ${newLeft}; top:${newTop}; width:${newWidth}; height:${newHeight}`);
      focusBox.setAttribute('aria-label', `${text}, ${index + 1} of ${this.hitBoxes.length}`);
    };

    hideFocusBox();
    focusBox.addEventListener('focus', moveFocusBox);
    focusBox.addEventListener('blur', hideFocusBox);
    focusBox.addEventListener('keydown', keyboardNavigation);
    focusBox.addEventListener('click', activateFocusBox);
    return focusBox;
  };
}

/**
 *
 * @param {Object} chart
 * @param {ChartLegendManager} manager
 */
const updateForLegends = (chart: Chart, manager: ChartLegendManager): void => {
  const { legend } = chart;
  if (!legend?.legendItems) {
    return manager.suppressFocusBox();
  }
  manager.hitBoxes =
    legend?.legendItems?.map(({ text }, index) => {
      return {
        // @ts-ignore
        ...(legend.legendHitBoxes?.[index] ?? {}),
        text,
      };
    }) ?? [];
};

/**
 *
 * @param {Object} chart
 * @param {Number} margin
 * @returns {ChartLegendManager}
 */
const initialize = (chart: Chart, margin: number): ChartLegendManager => {
  const manager = new ChartLegendManager(chart, margin);
  chartStates.set(chart, manager);
  return manager;
};

export const chartLegendA11y = {
  id: 'chartLegendA11y',
  afterInit: (chart: Chart, options: any): void => {
    const manager = initialize(chart, options.margin);
    updateForLegends(chart, manager);
  },
  beforeDraw: (chart: Chart, args: any, options: any): void => {
    let manager = chartStates.get(chart);
    if (manager === undefined) {
      manager = initialize(chart, options.margin);
    }
    if (!chart.options.plugins?.legend?.display) {
      return manager.suppressFocusBox();
    }
    manager.reviveFocusBox();
    manager.focusBoxMargin = options.margin || 4;
    updateForLegends(chart, manager);
  },
  afterDestroy(chart: Chart): void {
    chartStates.delete(chart);
  },
  defaults: {
    margin: 4,
  },
};
