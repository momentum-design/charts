import type { Chart as CJ } from 'chart.js/auto';
import { KeyboardCode } from '../../../types';

interface CJA11yLegend {
  id: string;
  afterInit: (chart: CJ, options: any) => void;
  beforeDraw: (chart: CJ, options: any) => void;
  afterDestroy: (chart: CJ) => void;
  defaults: {
    margin: number;
  };
}
interface HitBoxMeta {
  left: number;
  top: number;
  width: number;
  height: number;
  text: string;
}

export class A11yLegend {
  private hitBoxes: HitBoxMeta[] = [];
  private focusBoxMargin: number = 0;
  private focusBox: HTMLDivElement | null = null;
  private chart: any;
  private focusColor: string = '';

  public toCJPlugin(focusColor = 'blue'): CJA11yLegend {
    return {
      id: 'a11yLegend',
      afterInit: (chart: CJ, options: any): void => {
        this.initialize(chart, options.margin, focusColor);
        this.updateForLegends();
      },
      beforeDraw: (chart: CJ, options: any): void => {
        if (!this.chart) {
          this.initialize(chart, options.margin, focusColor);
        }
        if (!chart.options.plugins?.legend?.display) {
          return this.suppressFocusBox();
        }
        this.reviveFocusBox();
        this.focusBoxMargin = options.margin || 4;
        this.updateForLegends();
      },
      afterDestroy: (): void => {
        this.chart = null;
      },
      defaults: {
        margin: 4,
      },
    };
  }

  private initialize(chart: CJ, margin: number, focusColor: string): void {
    this.focusBoxMargin = margin;
    this.chart = chart;
    this.focusColor = focusColor;
    this.focusBox = this.generateFocusBox();
    chart.canvas.insertAdjacentElement('afterend', this.focusBox);
  }

  private updateForLegends(): void {
    const { legend } = this.chart;
    if (!legend?.legendItems) {
      return this.suppressFocusBox();
    }
    this.hitBoxes =
      legend?.legendItems?.map(({ text }: { text: string }, index: number) => {
        return {
          ...(legend.legendHitBoxes?.[index] ?? {}),
          text,
        };
      }) ?? [];
  }

  private suppressFocusBox(): void {
    this.focusBox?.setAttribute('tabIndex', '-1');
  }

  private reviveFocusBox(): void {
    this.focusBox?.setAttribute('tabIndex', '0');
  }

  private generateFocusBox(): HTMLDivElement {
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
      if (e.key === KeyboardCode.ArrowRight || e.key === KeyboardCode.ArrowDown) {
        e.preventDefault();
        e.stopPropagation();
        if (index >= maxIndex) {
          return;
        }
        focusBox.setAttribute('data-legend-index', String(index + 1));
        moveFocusBox();
        return;
      }
      if (e.key === KeyboardCode.ArrowLeft || e.key === KeyboardCode.ArrowUp) {
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
      const { left, top, width, height, text } = this.hitBoxes[index];

      const newLeft = `${left - this.focusBoxMargin}px`;
      const newTop = `${top - this.focusBoxMargin}px`;
      const newWidth = `${width + 2 * this.focusBoxMargin}px`;
      const newHeight = `${height + 2 * this.focusBoxMargin}px`;
      focusBox.setAttribute(
        'style',
        `position:absolute; left: ${newLeft}; top:${newTop}; width:${newWidth}; height:${newHeight}; outline-color:${this.focusColor};`,
      );
      focusBox.setAttribute('aria-label', `${text}, ${index + 1} of ${this.hitBoxes.length}`);
    };

    hideFocusBox();
    focusBox.addEventListener('focus', moveFocusBox);
    focusBox.addEventListener('blur', hideFocusBox);
    focusBox.addEventListener('keydown', keyboardNavigation);
    focusBox.addEventListener('click', activateFocusBox);
    return focusBox;
  }
}
