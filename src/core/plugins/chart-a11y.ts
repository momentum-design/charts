/* eslint-disable */
import { KeyboardCode } from './plugin.types';

interface State {
  currentState: {
    datasetIndex: number;
    index: number;
  };

  get(): { datasetIndex: number; index: number };
  set(value: { datasetIndex: number; index: number }): void;
  compare(newState: { datasetIndex: number; index: number }): boolean;
}

const state: State = {
  currentState: {
    datasetIndex: 0,
    index: 0,
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

/**
 * @description updates the a11y screen reader element with labelled active points
 * @param {Object} chart
 */
const updateA11yLabel = (chart: any): void => {
  const { datasetIndex, index } = state.get();
  const legendLabel = chart.config.data.datasets[datasetIndex].label;
  const currentLabel = chart.config.data.labels && chart.config.data.labels[index];
  const currentValue = chart.config.data.datasets[datasetIndex].data[index];

  const chartJsA11yLabel = document.getElementById('chartjs-a11y-label');
  if (chartJsA11yLabel) {
    chartJsA11yLabel.textContent = `${currentLabel}, ${legendLabel},  ${currentValue}`;
  }
};

/**
 * @param {Object} chart
 * @param {Number} datasetIndex
 * @param {Number} index
 */
const updateActivePoint = (chart: any, datasetIndex: number, index: number): void => {
  chart.setActiveElements([{ datasetIndex, index }]);
  chart.tooltip && chart.tooltip.setActiveElements([{ datasetIndex, index }], { x: 0, y: 0 });
  state.set({ datasetIndex, index });
};

/**
 * @description updates state with current activePoint, or set default state if no activePoint exists
 * @param {Object} activePoint
 */
const handleActivePoint = (activePoint: any) => {
  if (activePoint && !state.get()) {
    state.set(activePoint);
  } else if (activePoint && !state.compare(activePoint)) {
    state.set(activePoint);
  }
};

/**
 * @param {Object} chart
 * @param {Number} datasetIndex to start from
 * @returns {Number} next visible datasetIndex
 */
const findNextVisibleDataset = (chart: any, datasetIndex: number): number => {
  if (datasetIndex === chart.config.data.datasets.length - 1) {
    datasetIndex = 0;
  } else {
    datasetIndex += 1;
  }

  if (chart.isDatasetVisible(datasetIndex)) {
    return datasetIndex;
  }

  return findNextVisibleDataset(chart, datasetIndex);
};

/**
 * @param {Object} chart
 * @param {Number} datasetIndex to start from
 * @returns {Number} prev visible datasetIndex
 */
const findPrevVisibleDataset = (chart: any, datasetIndex: number): number => {
  if (datasetIndex === 0) {
    datasetIndex = chart.config.data.datasets.length - 1;
  } else {
    datasetIndex -= 1;
  }

  if (chart.isDatasetVisible(datasetIndex)) {
    return datasetIndex;
  }

  return findPrevVisibleDataset(chart, datasetIndex);
};

/**
 * @param {Object} chart
 * @param {Number} datasetIndex
 * @param {Number} index
 * @param {Object} currentDataset
 * @param {Number} datasetLength
 */
const handleRightKey = (chart: any, datasetIndex: number, index: number, currentDataset: any, datasetLength: number): void => {
  if (!chart.isDatasetVisible(datasetIndex)) {
    const newDatasetIndex = findNextVisibleDataset(chart, datasetIndex);

    updateActivePoint(chart, newDatasetIndex, 0);
  } else if (index === currentDataset.data.length - 1 && datasetIndex === datasetLength - 1) {
    updateActivePoint(chart, 0, 0);
  } else if (index === currentDataset.data.length - 1 && !chart.isDatasetVisible(datasetIndex + 1)) {
    const newDatasetIndex = findNextVisibleDataset(chart, datasetIndex);

    updateActivePoint(chart, newDatasetIndex, 0);
  } else if (index < currentDataset.data.length - 1) {
    updateActivePoint(chart, datasetIndex, index + 1);
  } else if (datasetLength > 1 && datasetIndex < datasetLength - 1) {
    updateActivePoint(chart, datasetIndex + 1, 0);
  } else {
    updateActivePoint(chart, datasetIndex, 0);
  }
};

/**
 * @param {Object} chart
 * @param {Number} datasetIndex
 * @param {Number} index
 * @param {Object} currentDataset
 * @param {Number} datasetLength
 */
const handleLeftKey = (chart: any, datasetIndex: number, index: number, currentDataset: any, datasetLength: number): void => {
  if (!chart.isDatasetVisible(datasetIndex)) {
    const newDatasetIndex = findPrevVisibleDataset(chart, datasetIndex);
    const newDataset = chart.config.data.datasets[newDatasetIndex];

    updateActivePoint(chart, newDatasetIndex, newDataset.data.length - 1);
  } else if (index === 0 && datasetIndex === 0) {
    updateActivePoint(chart, datasetLength - 1, currentDataset.data.length - 1);
  } else if (index === 0 && !chart.isDatasetVisible(datasetIndex - 1)) {
    const newDatasetIndex = findPrevVisibleDataset(chart, datasetIndex);
    const newDataset = chart.config.data.datasets[newDatasetIndex];

    updateActivePoint(chart, newDatasetIndex, newDataset.data.length - 1);
  } else if (index > 0) {
    updateActivePoint(chart, datasetIndex, index - 1);
  } else if (datasetLength > 1 && datasetIndex > 0) {
    const newDataset = chart.config.data.datasets[datasetIndex - 1];

    updateActivePoint(chart, datasetIndex - 1, newDataset.data.length - 1);
  } else {
    updateActivePoint(chart, datasetIndex, currentDataset.data.length - 1);
  }
};

/**
 * @param {Object} chart
 * @param {Number} datasetIndex
 * @param {Number} index
 */
const handleUpKey = (chart: any, datasetIndex: number, index: number): void => {
  const newDatasetIndex = findPrevVisibleDataset(chart, datasetIndex);

  updateActivePoint(chart, newDatasetIndex, index);
};

/**
 * @param {Object} chart
 * @param {Number} datasetIndex
 * @param {Number} index
 */
const handleDownKey = (chart: any, datasetIndex: number, index: number): void => {
  const newDatasetIndex = findNextVisibleDataset(chart, datasetIndex);

  updateActivePoint(chart, newDatasetIndex, index);
};

/**
 * @description creates hidden text element for screen reader
 */
const createA11yElement = (): void => {
  const a11yElement = document.createElement('div');
  a11yElement.setAttribute('id', 'chartjs-a11y-label');
  // remove from tab order as we only want user to access this via the chart element
  a11yElement.setAttribute('tabindex', '-1');
  a11yElement.setAttribute('role', 'status');
  a11yElement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
  document.body.appendChild(a11yElement);
};

/**
 * @description sets up plugin
 * @param {Object} chart
 * @param {Object} options
 */
const setup = (chart: any, options: any): void => {
  const { canvas } = chart;
  // application is a generic role for an interactive UI component
  canvas.setAttribute('role', 'application');
  // make canvas tabbable
  canvas.setAttribute('tabindex', '0');
  // set default AT label
  canvas.setAttribute('aria-label', options?.chartLabel || `${chart.config?._config.type} chart`);
  canvas.setAttribute('aria-describedby', 'chartjs-a11y-label');

  canvas.addEventListener('keydown', (event: any) => {
    const { key } = event;

    if (key === KeyboardCode.ArrowLeft || key === KeyboardCode.ArrowRight || key === KeyboardCode.ArrowUp || key === KeyboardCode.ArrowDown) {
      event.preventDefault();
    }
  });

  if (!document.getElementById('chartjs-a11y-label')) {
    createA11yElement();
  }
};

/**
 * @description sets active point when chart receives focus
 * @param {Object} chart
 */
const onFocus = (chart: any): void => {
  if (!state.get()) {
    const datasetIndex = 0;
    const index = 0;

    state.set({ datasetIndex, index });
    updateActivePoint(chart, datasetIndex, index);
  }
};

/**
 * @description controls key up events
 * @param {KeyboardEvent} event keyup
 * @param {Object} chart
 */
const onKeyDown = (event: any, chart: any): void => {
  const { key } = event.native;
  const { datasetIndex, index } = state.get();
  const currentDataset = chart.config._config.data.datasets[datasetIndex];
  const datasetLength = chart.config._config.data.datasets.length;

  if (key === KeyboardCode.ArrowRight) {
    handleRightKey(chart, datasetIndex, index, currentDataset, datasetLength);
  } else if (key === KeyboardCode.ArrowLeft) {
    handleLeftKey(chart, datasetIndex, index, currentDataset, datasetLength);
  } else if (key === KeyboardCode.ArrowUp) {
    handleUpKey(chart, datasetIndex, index);
  } else if (key === KeyboardCode.ArrowDown) {
    handleDownKey(chart, datasetIndex, index);
  }
};

export const ChartA11y = {
  id: 'ChartA11y',
  start: (chart: any, options: any): void => {
    // add event listeners
    chart.canvas.addEventListener('focus', () => onFocus(chart));
    // setup required elements
    setup(chart, options);
  },
  beforeInit: (chart: any): void => {
    const requiredEvents = ['keydown', 'mousemove', 'mouseenter', 'mouseout', 'click'];

    if (chart.config.options?.events) {
      chart.config.options.events = [...new Set([...chart.config.options.events, ...requiredEvents])];
    } else {
      chart.config.options.events = [...requiredEvents];
    }
  },
  beforeEvent: (chart: any, args: any): void => {
    const { event } = args;

    if (event.type === 'keydown') {
      onKeyDown(event, chart);
    } else {
      // get the current active chart point
      const activePoint = chart.getElementsAtEventForMode(event, 'index', { intersect: true }, true)[0];
      handleActivePoint(activePoint);
    }

    updateA11yLabel(chart);
  },
};
