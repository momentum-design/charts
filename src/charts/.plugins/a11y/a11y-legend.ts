import type { Chart as CJ } from 'chart.js/auto';
import { A11yLegendManager } from './a11y-legend-manager';

interface CJA11yLegend {
  id: string;
  afterInit: (chart: CJ, options: any) => void;
  beforeDraw: (chart: CJ, options: any) => void;
  afterDestroy: (chart: CJ) => void;
  defaults: {
    margin: number;
  };
}

export class A11yLegend {
  private chartStates = new Map();

  public toCJPlugin(focusColor = 'blue'): CJA11yLegend {
    return {
      id: 'a11yLegend',
      afterInit: (chart: CJ, options: any): void => {
        const manager = this.initialize(chart, options.margin, focusColor);
        this.updateForLegends(chart, manager);
      },
      beforeDraw: (chart: CJ, options: any): void => {
        let manager = this.chartStates.get(chart);
        if (manager === undefined) {
          manager = this.initialize(chart, options.margin, focusColor);
        }
        if (!chart.options.plugins?.legend?.display) {
          return manager.suppressFocusBox();
        }
        manager.reviveFocusBox();
        manager.focusBoxMargin = options.margin || 4;
        this.updateForLegends(chart, manager);
      },
      afterDestroy: (chart: CJ): void => {
        this.chartStates.delete(chart);
      },
      defaults: {
        margin: 4,
      },
    };
  }

  /**
   *
   * @param {Object} chart
   * @param {Number} margin
   * @returns {A11yLegendManager}
   */
  private initialize(chart: CJ, margin: number, focusColor: string): A11yLegendManager {
    const manager = new A11yLegendManager(chart, margin, focusColor);
    this.chartStates.set(chart, manager);
    return manager;
  }

  /**
   *
   * @param {Object} chart
   * @param {A11yLegendManager} manager
   */
  private updateForLegends(chart: CJ, manager: A11yLegendManager): void {
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
  }
}
