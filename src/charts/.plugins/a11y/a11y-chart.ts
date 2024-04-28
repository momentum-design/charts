import { Chart as CJ, ChartDataset } from 'chart.js/auto';
import { ChartType as CJType, KeyboardCode } from '../../../types';

interface A11yState {
  currentState: {
    datasetIndex: number;
    index: number;
  };

  get(): ActivePoint;
  set(value: ActivePoint): void;
  compare(newState: ActivePoint): boolean;
}

interface CJA11y {
  id: string;
  start: (chart: CJ, options: any) => void;
  beforeInit: (chart: CJ) => void;
  beforeEvent: (chart: CJ, args: any) => void;
}

interface ActivePoint {
  datasetIndex: number;
  index: number;
}

interface StyleAttributes {
  [key: string]: string;
}

interface DatasetStyleAttributes {
  color: StyleAttributes;
  width: StyleAttributes;
  [key: string]: StyleAttributes;
}

export class A11yChart {
  private state: A11yState = {
    currentState: {
      datasetIndex: 0,
      index: -1,
    },

    get() {
      return this.currentState;
    },

    set(value) {
      this.currentState = value;
    },

    compare(newState) {
      const datasetIndexMatch = this.currentState.datasetIndex === newState.datasetIndex;
      const indexMatch = this.currentState.index === newState.index;

      return datasetIndexMatch && indexMatch;
    },
  };

  private currentBorderColors: (number | string)[][] = [];
  private currentBorderWidths: number[] = [];
  private currentChartType = '';
  private currentActiveBorderWidth = 2;
  private currentActiveBorderColor = '';
  private whiteColor = 'white';

  public toCJPlugin(focusColor = 'blue'): CJA11y {
    this.currentActiveBorderColor = focusColor;

    return {
      id: 'a11yChart',
      start: (chart: CJ, options: { chartLabel: string }): void => {
        chart.canvas.addEventListener('focus', () => this.onFocus(chart));
        chart.canvas.addEventListener('blur', () => this.onBlur(chart));
        this.setup(chart, options);
      },
      beforeInit: (chart: CJ): void => {
        const requiredEvents: Array<keyof HTMLElementEventMap> = [
          'keydown',
          'mousemove',
          'mouseenter',
          'mouseout',
          'click',
        ];

        if (chart.config.options?.events) {
          chart.config.options.events = [...new Set([...chart.config.options.events, ...requiredEvents])];
        } else {
          chart.config.options!.events = [...requiredEvents];
        }
      },
      beforeEvent: (chart: CJ, args: any): void => {
        const { event } = args;
        if (event.type === 'keydown') {
          this.onKeyDown(event, chart);
        } else {
          const activePoint = chart.getElementsAtEventForMode(event, 'index', { intersect: true }, true)[0];
          this.handleActivePoint(chart, activePoint);
        }
        this.updateA11yLabel(chart);
      },
    };
  }

  /**
   ** Activate to change the current chart point style
   * @param {Object} chart
   * @param {Number} datasetIndex
   * @param {Number} index
   */
  private updateActivePoint(chart: CJ, datasetIndex: number, index: number): void {
    if (datasetIndex < 0 || index < 0) {
      return;
    }
    chart.setActiveElements([{ datasetIndex, index }]);
    chart.tooltip && chart.tooltip.setActiveElements([{ datasetIndex, index }], { x: 0, y: 0 });
    this.state.set({ datasetIndex, index });
    this.initializeBorderColors(chart, datasetIndex);
    this.updateChart(chart, datasetIndex, index);
  }

  /**
   * @description sets active point when chart receives focus
   * @param {Object} chart
   */
  private onFocus(chart: CJ): void {
    if (!this.state.get()) {
      const datasetIndex = 0;
      const index = 0;

      this.state.set({ datasetIndex, index });
      this.updateActivePoint(chart, datasetIndex, index);
    }
  }

  /**
   * @description clears the set active point and resets the variable when Blur
   * @param {Object} chart
   */
  private onBlur(chart: any): void {
    const { index } = this.state.get();
    if (index !== -1) {
      this.state.set({ datasetIndex: 0, index: -1 });
      chart.data.datasets.forEach((dataset: any, index: number) => {
        if (this.currentBorderColors) {
          dataset[this.getDatasetBorderStyleAttribute('color')] = this.currentBorderColors[index];
          if (this.currentChartType !== CJType.Line) {
            dataset[this.getDatasetBorderStyleAttribute('width')] = this.currentBorderWidths[index];
          }
        }
      });
      chart.tooltip._active = [];
      chart.tooltip.update(true);
      chart.update();
    }
  }

  /**
   * @description controls key up events
   * @param {KeyboardEvent} event keyup
   * @param {Object} chart
   */
  private onKeyDown(event: any, chart: any): void {
    const { key } = event.native;
    const { datasetIndex, index } = this.state.get();
    const currentDataset = chart.config._config.data.datasets[datasetIndex];
    const datasetLength = chart.config._config.data.datasets.length;

    if (key === KeyboardCode.ArrowRight) {
      this.handleRightKey(chart, datasetIndex, index, currentDataset, datasetLength);
    } else if (key === KeyboardCode.ArrowLeft) {
      this.handleLeftKey(chart, datasetIndex, index, currentDataset, datasetLength);
    } else if (key === KeyboardCode.ArrowUp) {
      this.handleUpKey(chart, datasetIndex, index);
    } else if (key === KeyboardCode.ArrowDown) {
      this.handleDownKey(chart, datasetIndex, index);
    }
  }

  /**
   * @description sets up plugin
   * @param {Object} chart
   * @param {Object} options
   */
  private setup(chart: any, options: { chartLabel: string }): void {
    const { canvas } = chart;
    // application is a generic role for an interactive UI component
    canvas.setAttribute('role', 'application');
    // make canvas tabbable
    canvas.setAttribute('tabindex', '0');
    // set default AT label
    canvas.setAttribute('aria-label', options?.chartLabel || `${chart.config?._config.type} chart`);
    canvas.setAttribute('aria-describedby', 'chartjs-a11y-label');

    canvas.addEventListener('keydown', (event: KeyboardEvent) => {
      const { key } = event;

      if (
        key === KeyboardCode.ArrowLeft ||
        key === KeyboardCode.ArrowRight ||
        key === KeyboardCode.ArrowUp ||
        key === KeyboardCode.ArrowDown
      ) {
        event.preventDefault();
      }
    });

    if (!document.getElementById('chartjs-a11y-label')) {
      this.createA11yElement();
    }
  }

  /**
   * @description creates hidden text element for screen reader
   */
  private createA11yElement(): void {
    const a11yElement = document.createElement('div');
    a11yElement.setAttribute('id', 'chartjs-a11y-label');
    // remove from tab order as we only want user to access this via the chart element
    a11yElement.setAttribute('tabindex', '-1');
    a11yElement.setAttribute('role', 'status');
    a11yElement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(a11yElement);
  }

  /**
   * @description update to chart ponit style
   * @param {Object} chart
   * @param {number} datasetIndex
   * @param {number} index
   */
  private updateChart(chart: CJ, datasetIndex: number, index: number): void {
    chart.data.datasets.forEach((dataset: any, dataIndex: number) => {
      if (this.currentBorderColors) {
        const currentA11yBorderColors = this.currentBorderColors[dataIndex];
        if (currentA11yBorderColors) {
          if (datasetIndex === dataIndex) {
            const currentBorderColors: (string | number)[] = currentA11yBorderColors.map(
              (color: string | number, colorIndex: number) =>
                colorIndex === index ? this.currentActiveBorderColor : color,
            );
            dataset[this.getDatasetBorderStyleAttribute('color')] = currentBorderColors;
          } else {
            dataset[this.getDatasetBorderStyleAttribute('color')] = currentA11yBorderColors;
          }
        }
      }
      if (this.currentBorderWidths && this.currentChartType !== CJType.Line) {
        if (datasetIndex === dataIndex) {
          dataset.borderWidth = this.currentBorderWidths.map((width, widthIndex) =>
            widthIndex === index ? this.currentActiveBorderWidth : width,
          );
        } else {
          dataset.borderWidth = this.currentBorderWidths[datasetIndex];
        }
      }
    });
    chart.update();
  }

  /**
   * @param {Object} chart
   * @param {Number} datasetIndex
   * @param {Number} index
   * @param {Object} currentDataset
   * @param {Number} datasetLength
   */
  private handleRightKey(
    chart: CJ,
    datasetIndex: number,
    index: number,
    currentDataset: ChartDataset,
    datasetLength: number,
  ): void {
    if (!chart.isDatasetVisible(datasetIndex)) {
      const newDatasetIndex = this.findNextVisibleDataset(chart, datasetIndex);

      this.updateActivePoint(chart, newDatasetIndex, 0);
    } else if (index === currentDataset.data.length - 1 && datasetIndex === datasetLength - 1) {
      this.updateActivePoint(chart, 0, 0);
    } else if (index === currentDataset.data.length - 1 && !chart.isDatasetVisible(datasetIndex + 1)) {
      const newDatasetIndex = this.findNextVisibleDataset(chart, datasetIndex);

      this.updateActivePoint(chart, newDatasetIndex, 0);
    } else if (index < currentDataset.data.length - 1) {
      this.updateActivePoint(chart, datasetIndex, index + 1);
    } else if (datasetLength > 1 && datasetIndex < datasetLength - 1) {
      this.updateActivePoint(chart, datasetIndex + 1, 0);
    } else {
      this.updateActivePoint(chart, datasetIndex, 0);
    }
  }

  /**
   * @param {Object} chart
   * @param {Number} datasetIndex
   * @param {Number} index
   * @param {Object} currentDataset
   * @param {Number} datasetLength
   */
  private handleLeftKey(
    chart: CJ,
    datasetIndex: number,
    index: number,
    currentDataset: ChartDataset,
    datasetLength: number,
  ): void {
    if (!chart.isDatasetVisible(datasetIndex)) {
      const newDatasetIndex = this.findPrevVisibleDataset(chart, datasetIndex);
      const newDataset = chart.config.data.datasets[newDatasetIndex];

      this.updateActivePoint(chart, newDatasetIndex, newDataset.data.length - 1);
    } else if (index === 0 && datasetIndex === 0) {
      this.updateActivePoint(chart, datasetLength - 1, currentDataset.data.length - 1);
    } else if (index === 0 && !chart.isDatasetVisible(datasetIndex - 1)) {
      const newDatasetIndex = this.findPrevVisibleDataset(chart, datasetIndex);
      const newDataset = chart.config.data.datasets[newDatasetIndex];

      this.updateActivePoint(chart, newDatasetIndex, newDataset.data.length - 1);
    } else if (index > 0) {
      this.updateActivePoint(chart, datasetIndex, index - 1);
    } else if (datasetLength > 1 && datasetIndex > 0) {
      const newDataset = chart.config.data.datasets[datasetIndex - 1];

      this.updateActivePoint(chart, datasetIndex - 1, newDataset.data.length - 1);
    } else {
      this.updateActivePoint(chart, datasetIndex, currentDataset.data.length - 1);
    }
  }

  /**
   * @param {Object} chart
   * @param {Number} datasetIndex
   * @param {Number} index
   */
  private handleUpKey(chart: CJ, datasetIndex: number, index: number): void {
    const newDatasetIndex = this.findPrevVisibleDataset(chart, datasetIndex);

    this.updateActivePoint(chart, newDatasetIndex, index);
  }

  /**
   * @param {Object} chart
   * @param {Number} datasetIndex
   * @param {Number} index
   */
  private handleDownKey(chart: CJ, datasetIndex: number, index: number): void {
    const newDatasetIndex = this.findNextVisibleDataset(chart, datasetIndex);

    this.updateActivePoint(chart, newDatasetIndex, index);
  }

  /**
   * @param {Object} chart
   * @param {Number} datasetIndex to start from
   * @returns {Number} prev visible datasetIndex
   */
  private findPrevVisibleDataset(chart: CJ, datasetIndex: number): number {
    if (datasetIndex === 0) {
      datasetIndex = chart.config.data.datasets.length - 1;
    } else {
      datasetIndex -= 1;
    }

    if (chart.isDatasetVisible(datasetIndex)) {
      return datasetIndex;
    }

    return this.findPrevVisibleDataset(chart, datasetIndex);
  }

  /**
   * @param {Object} chart
   * @param {Number} datasetIndex to start from
   * @returns {Number} next visible datasetIndex
   */
  private findNextVisibleDataset(chart: CJ, datasetIndex: number): number {
    if (datasetIndex === chart.config.data.datasets.length - 1) {
      datasetIndex = 0;
    } else {
      datasetIndex += 1;
    }

    if (chart.isDatasetVisible(datasetIndex)) {
      return datasetIndex;
    }

    return this.findNextVisibleDataset(chart, datasetIndex);
  }

  /**
   * @description updates state with current activePoint, or set default state if no activePoint exists
   * @param {Object} activePoint
   */
  private handleActivePoint(chart: CJ, activePoint: ActivePoint): void {
    if (activePoint && !this.state.get()) {
      this.state.set(activePoint);
      this.initializeBorderColors(chart, activePoint.datasetIndex);
    } else if (activePoint && !this.state.compare(activePoint)) {
      this.state.set(activePoint);
      this.initializeBorderColors(chart, activePoint.datasetIndex);
    }
  }

  /**
   * @description updates the a11y screen reader element with labelled active points
   * @param {Object} chart
   */
  private updateA11yLabel(chart: CJ): void {
    const { datasetIndex, index } = this.state.get();
    const legendLabel = chart.config.data.datasets[datasetIndex]?.label;
    const currentLabel = chart.config.data.labels && chart.config.data.labels[index];
    const currentValue = chart.config.data.datasets[datasetIndex]?.data[index];

    const chartJsA11yLabel = document.getElementById('chartjs-a11y-label');
    if (chartJsA11yLabel) {
      chartJsA11yLabel.textContent = `${currentLabel}, ${legendLabel},  ${currentValue}`;
    }
  }

  /**
   * @description determine if not XY chart type
   * @param {String} chartType
   */
  private hasNotXYType(): boolean {
    return (
      this.currentChartType === CJType.Donut ||
      this.currentChartType === CJType.Pie ||
      this.currentChartType === CJType.Gauge ||
      this.currentChartType === 'doughnut'
    );
  }

  /**
   * @description by attributeType and currentChartType, get the set attribute
   * @param {String} attributeType
   */
  private getDatasetBorderStyleAttribute(attributeType: string): string {
    const attributeMapping: DatasetStyleAttributes = {
      color: {
        [CJType.Line]: 'pointBorderColor',
        default: 'borderColor',
      },
      width: {
        [CJType.Line]: 'pointBorderWidth',
        default: 'borderWidth',
      },
    };
    const type = this.currentChartType ?? 'default';
    return attributeMapping[attributeType][type] || attributeMapping[attributeType].default;
  }
  /**
   * @description get the current chart border colors histogram from the current datasetIndex and initialize the variable.
   * @param {CJ} chart
   * @param {number} datasetIndex
   */
  private initializeBorderColors(chart: CJ, datasetIndex: number): void {
    if (this.currentChartType === '') {
      const currentChartDataLength = chart.data.datasets[datasetIndex]?.data.length;
      this.currentChartType = chart.data.datasets[datasetIndex]?.type || '';
      const chartAttrWidth = this.getDatasetBorderStyleAttribute('width');
      this.currentBorderColors = [];
      this.currentBorderWidths = [];
      chart.data.datasets.forEach((dataset: any) => {
        if (this.hasNotXYType()) {
          //TODO(zupan) need to support gauge chart
          this.currentBorderColors?.push(Array(currentChartDataLength).fill(this.whiteColor));
        } else {
          if (dataset.backgroundColor) {
            typeof dataset.backgroundColor === 'string'
              ? this.currentBorderColors?.push(Array(currentChartDataLength).fill(dataset.backgroundColor))
              : this.currentBorderColors?.push(dataset.backgroundColor);
          } else {
            this.currentBorderColors?.push(Array(currentChartDataLength).fill(''));
          }
        }
        this.currentBorderWidths = dataset[chartAttrWidth]
          ? typeof dataset[chartAttrWidth] === 'number'
            ? Array(currentChartDataLength).fill(dataset[chartAttrWidth])
            : (dataset[chartAttrWidth] as number[])
          : Array(currentChartDataLength).fill(0);
      });
    }
  }
}
